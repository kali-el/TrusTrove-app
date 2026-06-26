import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseContractClient, TransactionTimeoutError } from './base.js';
import * as config from './config.js';
import { rpc, xdr, Networks } from '@stellar/stellar-sdk';
import * as freighter from '@stellar/freighter-api';

vi.mock('./config.js');
vi.mock('@stellar/freighter-api');

class TestClient extends BaseContractClient {
  public testReadContract(method: string, args: xdr.ScVal[], publicKey: string, parse: (val: xdr.ScVal) => any) {
    return this.readContract(method, args, publicKey, parse);
  }

  public testWriteContract(method: string, args: xdr.ScVal[], publicKey: string) {
    return this.writeContract(method, args, publicKey);
  }
}

describe('BaseContractClient', () => {
  let client: TestClient;
  let mockServer: any;

  beforeEach(() => {
    client = new TestClient('CCXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    
    mockServer = {
      getAccount: vi.fn().mockResolvedValue({
        accountId: () => 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        sequenceNumber: () => '1',
        incrementSequenceNumber: vi.fn()
      }),
      simulateTransaction: vi.fn(),
      prepareTransaction: vi.fn().mockResolvedValue({
        toXDR: vi.fn().mockReturnValue('mock-xdr')
      }),
      sendTransaction: vi.fn(),
      getTransaction: vi.fn()
    };

    vi.mocked(config.getConfig).mockReturnValue({
      networkPassphrase: Networks.TESTNET,
      horizonUrl: 'https://horizon-testnet.stellar.org',
      sorobanRpcUrl: 'https://soroban-testnet.stellar.org',
      contractIds: {
        registry: 'CCREG',
        invoice: 'CCINV',
        pool: 'CCPOOL',
        escrow: 'CCESC'
      },
      usdc: {
        issuer: 'GBUSDC',
        assetCode: 'USDC'
      }
    });

    vi.mocked(config.getSorobanServer).mockReturnValue(mockServer as unknown as rpc.Server);
    vi.mocked(freighter.signTransaction).mockResolvedValue('signed-xdr');
  });

  describe('readContract', () => {
    it('successfully reads a contract', async () => {
      mockServer.simulateTransaction.mockResolvedValue({
        result: {
          retval: xdr.ScVal.scvU32(42)
        }
      });

      const result = await client.testReadContract(
        'test_method',
        [],
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        (val) => val.u32()
      );

      expect(result).toBe(42);
      expect(mockServer.simulateTransaction).toHaveBeenCalledTimes(1);
    });

    it('handles simulation errors', async () => {
      mockServer.simulateTransaction.mockResolvedValue({
        error: 'Simulation failed'
      });

      await expect(
        client.testReadContract(
          'test_method',
          [],
          'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
          (val) => val.u32()
        )
      ).rejects.toThrow('Simulation failed for test_method: Simulation failed');
    });
  });

  describe('writeContract', () => {
    it('successfully writes to a contract', async () => {
      mockServer.simulateTransaction.mockResolvedValue({
        result: { retval: xdr.ScVal.scvVoid() },
        transactionData: {
          getReadOnly: () => [],
          getReadWrite: () => []
        },
        minResourceFee: '100'
      });

      mockServer.sendTransaction.mockResolvedValue({
        status: 'PENDING',
        hash: 'mock-hash'
      });

      mockServer.getTransaction.mockResolvedValue({
        status: rpc.Api.GetTransactionStatus.SUCCESS
      });

      const hash = await client.testWriteContract(
        'test_method',
        [],
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );

      expect(hash).toBe('mock-hash');
      expect(mockServer.simulateTransaction).toHaveBeenCalledTimes(1);
      expect(mockServer.prepareTransaction).toHaveBeenCalledTimes(1);
      expect(freighter.signTransaction).toHaveBeenCalledTimes(1);
      expect(mockServer.sendTransaction).toHaveBeenCalledTimes(1);
    });

    it('handles transaction timeout error', async () => {
      mockServer.simulateTransaction.mockResolvedValue({
        result: { retval: xdr.ScVal.scvVoid() },
        transactionData: {
          getReadOnly: () => [],
          getReadWrite: () => []
        },
        minResourceFee: '100'
      });

      mockServer.sendTransaction.mockResolvedValue({
        status: 'PENDING',
        hash: 'mock-hash'
      });

      mockServer.getTransaction.mockResolvedValue({
        status: rpc.Api.GetTransactionStatus.NOT_FOUND
      });

      // To avoid actually waiting 30 seconds in tests, we could mock the retry delay
      // But testing timeout logic directly is fine too
      // However to not block the whole test run we will just simulate it
      vi.useFakeTimers();
      
      const promise = client.testWriteContract(
        'test_method',
        [],
        'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      );

      // Advance timers by 30 * 1000 = 30000ms
      for (let i = 0; i < 35; i++) {
        await vi.advanceTimersByTimeAsync(1000);
      }

      await expect(promise).rejects.toThrow(TransactionTimeoutError);
      
      vi.useRealTimers();
    });
  });
});
