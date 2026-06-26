import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EscrowClient } from './escrow.js';
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

describe('EscrowClient', () => {
  let client: EscrowClient;

  beforeEach(() => {
    client = new EscrowClient('CCESC');
  });

  describe('lock', () => {
    it('calls writeContract with correct arguments', async () => {
      vi.mocked(client['writeContract']).mockResolvedValue('mock-hash');

      const result = await client.lock(
        'abcd',
        1000n,
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );

      expect(result).toBe(true);
      expect(client['writeContract']).toHaveBeenCalledWith(
        'lock',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );
    });
  });

  describe('releaseToIssuer', () => {
    it('calls writeContract with correct arguments', async () => {
      vi.mocked(client['writeContract']).mockResolvedValue('mock-hash');

      const result = await client.releaseToIssuer(
        'abcd',
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );

      expect(result).toBe(true);
      expect(client['writeContract']).toHaveBeenCalledWith(
        'release_to_issuer',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );
    });
  });

  describe('releaseToPool', () => {
    it('calls writeContract with correct arguments', async () => {
      vi.mocked(client['writeContract']).mockResolvedValue('mock-hash');

      const result = await client.releaseToPool(
        'abcd',
        1000n,
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );

      expect(result).toBe(true);
      expect(client['writeContract']).toHaveBeenCalledWith(
        'release_to_pool',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );
    });
  });

  describe('handleDefault', () => {
    it('calls writeContract with correct arguments', async () => {
      vi.mocked(client['writeContract']).mockResolvedValue('mock-hash');

      const result = await client.handleDefault(
        'abcd',
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );

      expect(result).toBe(true);
      expect(client['writeContract']).toHaveBeenCalledWith(
        'handle_default',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );
    });
  });

  describe('getLocked', () => {
    it('calls readContract with correct arguments', async () => {
      vi.mocked(client['readContract']).mockResolvedValue(1000n);

      const result = await client.getLocked('abcd', 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

      expect(result).toBe(1000n);
      expect(client['readContract']).toHaveBeenCalledWith(
        'get_locked',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        expect.any(Function)
      );
    });
  });
});
