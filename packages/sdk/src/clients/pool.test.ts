import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PoolClient } from './pool.js';
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

describe('PoolClient', () => {
  let client: PoolClient;

  beforeEach(() => {
    client = new PoolClient('CCPOOL');
  });

  describe('deposit', () => {
    it('calls writeContract with correct arguments', async () => {
      vi.mocked(client['writeContract']).mockResolvedValue('mock-hash');

      const result = await client.deposit(
        'GBLP',
        1000n,
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );

      expect(result).toBe('mock-hash');
      expect(client['writeContract']).toHaveBeenCalledWith(
        'deposit',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );
    });
  });

  describe('withdraw', () => {
    it('calls writeContract with correct arguments', async () => {
      vi.mocked(client['writeContract']).mockResolvedValue('mock-hash');

      const result = await client.withdraw(
        'GBLP',
        500n,
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );

      expect(result).toBe('mock-hash');
      expect(client['writeContract']).toHaveBeenCalledWith(
        'withdraw',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );
    });
  });

  describe('fundInvoice', () => {
    it('calls writeContract with correct arguments', async () => {
      vi.mocked(client['writeContract']).mockResolvedValue('mock-hash');

      const result = await client.fundInvoice(
        'abcd',
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );

      expect(result).toBe(true);
      expect(client['writeContract']).toHaveBeenCalledWith(
        'fund_invoice',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );
    });
  });

  describe('receiveRepayment', () => {
    it('calls writeContract with correct arguments', async () => {
      vi.mocked(client['writeContract']).mockResolvedValue('mock-hash');

      const result = await client.receiveRepayment(
        'abcd',
        1000n,
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );

      expect(result).toBe(true);
      expect(client['writeContract']).toHaveBeenCalledWith(
        'receive_repayment',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );
    });
  });

  describe('getStats', () => {
    it('calls readContract with correct arguments', async () => {
      const mockStats = { totalValueLocked: 1000n };
      vi.mocked(client['readContract']).mockResolvedValue(mockStats);

      const result = await client.getStats('GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

      expect(result).toEqual(mockStats);
      expect(client['readContract']).toHaveBeenCalledWith(
        'get_stats',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        expect.any(Function)
      );
    });
  });

  describe('getLPPosition', () => {
    it('calls readContract with correct arguments', async () => {
      const mockPosition = { shares: 500n };
      vi.mocked(client['readContract']).mockResolvedValue(mockPosition);

      const result = await client.getLPPosition('GBLP', 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

      expect(result).toEqual(mockPosition);
      expect(client['readContract']).toHaveBeenCalledWith(
        'get_lp_position',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        expect.any(Function)
      );
    });
  });

  describe('getUtilizationRate', () => {
    it('calls readContract with correct arguments', async () => {
      vi.mocked(client['readContract']).mockResolvedValue(50);

      const result = await client.getUtilizationRate('GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

      expect(result).toBe(50);
      expect(client['readContract']).toHaveBeenCalledWith(
        'get_utilization_rate',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        expect.any(Function)
      );
    });
  });
});
