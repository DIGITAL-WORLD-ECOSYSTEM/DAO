export class DIDResolver {
  static async resolve(did: string): Promise<any> {
    return {
      didDocument: {
        id: did,
        verificationMethod: [],
      },
    };
  }

  static generateDocument(username: string, publicKey: string): any {
    return {
      id: `did:dao:asppibra:${username}`,
      verificationMethod: [{ id: `${username}#key-1`, publicKeyBase58: publicKey }],
    };
  }
}
