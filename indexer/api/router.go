package api

import (
	"context"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				http.Error(w, "Unauthorized: missing token", http.StatusUnauthorized)
				return
			}

			var tokenStr string
			n, err := fmt.Sscanf(authHeader, "Bearer %s", &tokenStr)
			if err != nil || n != 1 {
				http.Error(w, "Unauthorized: invalid header format", http.StatusUnauthorized)
				return
			}

			token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
				if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
				}
				return []byte(jwtSecret), nil
			})

			if err != nil || !token.Valid {
				http.Error(w, "Unauthorized: invalid or expired token", http.StatusUnauthorized)
				return
			}

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				http.Error(w, "Unauthorized: invalid claims", http.StatusUnauthorized)
				return
			}

			sub, ok := claims["sub"].(string)
			if !ok {
				http.Error(w, "Unauthorized: missing sub claim", http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), "user_address", sub)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func CORSMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

func NewRouter(h *APIHandler) *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(CORSMiddleware())

	// Health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status": "ok"}`))
	})

	// Unprotected authentication routes
	r.Get("/auth", h.HandleGetAuth)
	r.Post("/auth", h.HandlePostAuth)

	// Public protocol stats (cached, no auth)
	r.Get("/stats", h.HandleGetStats)

	// Invoices and Pool routes
	r.Get("/invoices/{id}", h.HandleGetInvoiceByID)
	r.Get("/invoices", h.HandleGetInvoices)
	r.Get("/pool/stats", h.HandleGetPoolStats)
	r.Get("/pool/position/{address}", h.HandleGetLPPosition)

	// Protected routes
	r.Group(func(r chi.Router) {
		r.Use(AuthMiddleware(h.cfg.JWTSecret))
		r.Post("/invoices", h.HandleCreateInvoice)
	})

	return r
}
