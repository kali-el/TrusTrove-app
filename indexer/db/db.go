package db

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"path/filepath"
	"sort"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func InitDB(ctx context.Context, databaseURL string) error {
	var err error
	Pool, err = pgxpool.New(ctx, databaseURL)
	if err != nil {
		return fmt.Errorf("db: failed to connect to database: %w", err)
	}

	// Ping database to confirm connection
	if err := Pool.Ping(ctx); err != nil {
		return fmt.Errorf("db: failed to ping database: %w", err)
	}

	// Run initial migration
	if err := RunMigration(ctx); err != nil {
		return fmt.Errorf("db: failed to run migrations: %w", err)
	}

	return nil
}

func RunMigration(ctx context.Context) error {
	var migrationDir string
	migrationDir = filepath.Join("db", "migrations")
	if _, err := os.Stat(migrationDir); os.IsNotExist(err) {
		migrationDir = filepath.Join("indexer", "db", "migrations")
	}

	entries, err := os.ReadDir(migrationDir)
	if err != nil {
		return fmt.Errorf("failed to read migration directory: %w", err)
	}

	sort.Slice(entries, func(i, j int) bool {
		return entries[i].Name() < entries[j].Name()
	})

	for _, entry := range entries {
		if filepath.Ext(entry.Name()) != ".sql" {
			continue
		}
		migrationBytes, err := os.ReadFile(filepath.Join(migrationDir, entry.Name()))
		if err != nil {
			return fmt.Errorf("failed to read migration file %s: %w", entry.Name(), err)
		}
		_, err = Pool.Exec(ctx, string(migrationBytes))
		if err != nil {
			return fmt.Errorf("failed to execute migration %s: %w", entry.Name(), err)
		}
		slog.Info("Applied migration", "file", entry.Name())
	}

	return nil
}
