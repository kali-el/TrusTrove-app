import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegistryClient } from './registry.js';
import { BaseContractClient } from '../base.js';

vi.mock('../base.js', () => {
  return {
    BaseContractClient: class {
      contractId: string;
      constructor(contractId: string) {
        this.contractId = contractId;
      }
      writeContract = vi.fn();
      readContract = vi.fn();
    }
  };
});

describe('RegistryClient', () => {
  let client: RegistryClient;

  beforeEach(() => {
    client = new RegistryClient('CCREG');
  });

  describe('registerIssuer', () => {
    it('calls writeContract with correct arguments', async () => {
      vi.mocked(client['writeContract']).mockResolvedValue('mock-hash');

      const result = await client.registerIssuer(
        'GBISSUER',
        { name: 'Issuer Co' },
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );

      expect(result).toBe('mock-hash');
      expect(client['writeContract']).toHaveBeenCalledWith(
        'register_issuer',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );
    });
  });

  describe('registerBuyer', () => {
    it('calls writeContract with correct arguments', async () => {
      vi.mocked(client['writeContract']).mockResolvedValue('mock-hash');

      const result = await client.registerBuyer(
        'GBBUYER',
        { name: 'Buyer Co' },
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );

      expect(result).toBe('mock-hash');
      expect(client['writeContract']).toHaveBeenCalledWith(
        'register_buyer',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );
    });
  });

  describe('isVerified', () => {
    it('calls readContract with correct arguments', async () => {
      vi.mocked(client['readContract']).mockResolvedValue(true);

      const result = await client.isVerified('GBUSER', 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

      expect(result).toBe(true);
      expect(client['readContract']).toHaveBeenCalledWith(
        'is_verified',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        expect.any(Function)
      );
    });
  });

  describe('getProfile', () => {
    it('calls readContract with correct arguments', async () => {
      const mockProfile = { address: 'GBUSER', role: 'issuer', verified: true, metadata: {} };
      vi.mocked(client['readContract']).mockResolvedValue(mockProfile);

      const result = await client.getProfile('GBUSER', 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

      expect(result).toEqual(mockProfile);
      expect(client['readContract']).toHaveBeenCalledWith(
        'get_profile',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        expect.any(Function)
      );
    });
  });

  describe('revoke', () => {
    it('calls writeContract with correct arguments', async () => {
      vi.mocked(client['writeContract']).mockResolvedValue('mock-hash');

      const result = await client.revoke(
        'GBUSER',
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );

      expect(result).toBe('mock-hash');
      expect(client['writeContract']).toHaveBeenCalledWith(
        'revoke',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );
    });
  });
});
