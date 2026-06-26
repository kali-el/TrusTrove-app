import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InvoiceClient } from './invoice.js';
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

describe('InvoiceClient', () => {
  let client: InvoiceClient;

  beforeEach(() => {
    client = new InvoiceClient('CCINV');
  });

  describe('create', () => {
    it('calls writeContract with correct arguments', async () => {
      vi.mocked(client['writeContract']).mockResolvedValue('mock-hash');

      const result = await client.create(
        'GBISSUER',
        'GBBUYER',
        1000n,
        1234567890,
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );

      expect(result).toBe('mock-hash');
      expect(client['writeContract']).toHaveBeenCalledWith(
        'create',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );
    });
  });

  describe('listForFinancing', () => {
    it('calls writeContract with correct arguments', async () => {
      vi.mocked(client['writeContract']).mockResolvedValue('mock-hash');

      const result = await client.listForFinancing(
        'abcd',
        500,
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );

      expect(result).toBe(true);
      expect(client['writeContract']).toHaveBeenCalledWith(
        'list_for_financing',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );
    });
  });

  describe('markShipped', () => {
    it('calls writeContract with correct arguments', async () => {
      vi.mocked(client['writeContract']).mockResolvedValue('mock-hash');

      const result = await client.markShipped(
        'abcd',
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );

      expect(result).toBe(true);
      expect(client['writeContract']).toHaveBeenCalledWith(
        'mark_shipped',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );
    });
  });

  describe('confirmDelivery', () => {
    it('calls writeContract with correct arguments', async () => {
      vi.mocked(client['writeContract']).mockResolvedValue('mock-hash');

      const result = await client.confirmDelivery(
        'abcd',
        'GBCONFIRMER',
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );

      expect(result).toBe(true);
      expect(client['writeContract']).toHaveBeenCalledWith(
        'confirm_delivery',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );
    });
  });

  describe('repay', () => {
    it('calls writeContract with correct arguments', async () => {
      vi.mocked(client['writeContract']).mockResolvedValue('mock-hash');

      const result = await client.repay(
        'abcd',
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );

      expect(result).toBe(true);
      expect(client['writeContract']).toHaveBeenCalledWith(
        'repay',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );
    });
  });

  describe('triggerDefault', () => {
    it('calls writeContract with correct arguments', async () => {
      vi.mocked(client['writeContract']).mockResolvedValue('mock-hash');

      const result = await client.triggerDefault(
        'abcd',
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );

      expect(result).toBe(true);
      expect(client['writeContract']).toHaveBeenCalledWith(
        'trigger_default',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );
    });
  });

  describe('get', () => {
    it('calls readContract with correct arguments', async () => {
      const mockInvoice = { id: 'abcd', status: 'created' };
      vi.mocked(client['readContract']).mockResolvedValue(mockInvoice);

      const result = await client.get('abcd', 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

      expect(result).toEqual(mockInvoice);
      expect(client['readContract']).toHaveBeenCalledWith(
        'get',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        expect.any(Function)
      );
    });
  });

  describe('getByStatus', () => {
    it('calls readContract with correct arguments', async () => {
      const mockInvoices = [{ id: 'abcd', status: 'created' }];
      vi.mocked(client['readContract']).mockResolvedValue(mockInvoices);

      const result = await client.getByStatus('created' as any, 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

      expect(result).toEqual(mockInvoices);
      expect(client['readContract']).toHaveBeenCalledWith(
        'get_by_status',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        expect.any(Function)
      );
    });
  });

  describe('getByIssuer', () => {
    it('calls readContract with correct arguments', async () => {
      const mockInvoices = [{ id: 'abcd', status: 'created' }];
      vi.mocked(client['readContract']).mockResolvedValue(mockInvoices);

      const result = await client.getByIssuer('GBISSUER', 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

      expect(result).toEqual(mockInvoices);
      expect(client['readContract']).toHaveBeenCalledWith(
        'get_by_issuer',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        expect.any(Function)
      );
    });
  });

  describe('getByBuyer', () => {
    it('calls readContract with correct arguments', async () => {
      const mockInvoices = [{ id: 'abcd', status: 'created' }];
      vi.mocked(client['readContract']).mockResolvedValue(mockInvoices);

      const result = await client.getByBuyer('GBBUYER', 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

      expect(result).toEqual(mockInvoices);
      expect(client['readContract']).toHaveBeenCalledWith(
        'get_by_buyer',
        expect.any(Array),
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        expect.any(Function)
      );
    });
  });
});
