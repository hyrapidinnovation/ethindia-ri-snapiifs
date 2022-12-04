import { OnRpcRequestHandler } from '@metamask/snap-types';
import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';
var CryptoJS = require("crypto-js");
import {create} from "ipfs-core";
/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  const ethNode:any = await wallet.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: 60,
    },
  });

  const deriveEthAddress = await getBIP44AddressKeyDeriver(ethNode);
// U2FsdGVkX195qBVMvw32zLtU6p0+mPsRSIIrPYMZRGE=
  switch (request.method) {

    case 'encrypt_buffer':
      const addressKey0 = await deriveEthAddress(0);

      const dataToEncrypt = request.params[0]

      var encryptedText = CryptoJS.AES.encrypt(dataToEncrypt, addressKey0.privateKey?.toString()).toString();

      const response = await wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description:
              'Following is the encrypted text:',
            textAreaContent:
              `${encryptedText}`,
          },
        ],
      });    
      return response;

    case 'decrypt_buffer':
      const addressKey0D = await deriveEthAddress(0);

      const dataToDecrypt = request.params[0]

      //var decryptedText = CryptoJS.AES.decrypt(dataToDecrypt, addressKey0D.privateKey?.toString()).toString();
      const decryptedText = CryptoJS.AES.decrypt(dataToDecrypt, addressKey0D.privateKey?.toString());
      const originalText = decryptedText.toString(CryptoJS.enc.Utf8);

      const responseD = await wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description:
              'Following is the decrypted text:',
            textAreaContent:
              `${originalText}`,
          },
        ],
      });    
      return responseD;

    case 'encrypt_and_store':
        const addressKey01 = await deriveEthAddress(0);
  
        const dataToEncrypt1 = request.params[0]
  
        var encryptedText1 = CryptoJS.AES.encrypt(dataToEncrypt1, addressKey01.privateKey?.toString()).toString();

        // const ipfs = await IPFS.create()
        // // const { cid } = await ipfs.add("encryptedText1")
        
        
        const response1 = await wallet.request({
          method: 'snap_confirm',
          params: [
            {
              prompt: getMessage(origin),
              description:
                'Following is the cid of encrypted data uploaded to ipfs:',
              textAreaContent:
                `${encryptedText1}`,
            },
          ],
        });    
        return response1;
  
      case 'decrypt_and_retrieve':
        const addressKey0D1 = await deriveEthAddress(0);
  
        const dataToDecrypt1 = request.params[0]
  
        //var decryptedText = CryptoJS.AES.decrypt(dataToDecrypt, addressKey0D.privateKey?.toString()).toString();
        const decryptedText1 = CryptoJS.AES.decrypt(dataToDecrypt1, addressKey0D1.privateKey?.toString());
        const originalText1 = decryptedText1.toString(CryptoJS.enc.Utf8);
  
        const responseD1 = await wallet.request({
          method: 'snap_confirm',
          params: [
            {
              prompt: getMessage(origin),
              description:
                'Following is the decrypted text:',
              textAreaContent:
                `${originalText}`,
            },
          ],
        });    
        return responseD;
  
      default:
      throw new Error('Method not found.');
  }
};
