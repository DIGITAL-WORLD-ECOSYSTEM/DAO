/**
 * DID Resolver: Generates W3C-compliant DID Documents for ASPPIBRA-DAO.
 * Standard: did:dao:asppibra:<handle>
 */
export class DIDResolver {
	static generateDocument(username: string, publicKey: string, previousPublicKeys?: string[]) {
		const did = `did:dao:asppibra:${username.toLowerCase()}`;

		const verificationMethods: any[] = [];
		const activeKeyId = `${did}#key-1`;

		if (publicKey) {
			const jwk = this.toJWK(publicKey);
			if (jwk) {
				verificationMethods.push({
					id: activeKeyId,
					type: 'Ed25519VerificationKey2020',
					controller: did,
					publicKeyJwk: jwk,
				});
			}
		}

		if (previousPublicKeys && previousPublicKeys.length > 0) {
			previousPublicKeys.forEach((prevKey, index) => {
				const jwk = this.toJWK(prevKey);
				if (jwk) {
					verificationMethods.push({
						id: `${did}#key-rotated-${index + 1}`,
						type: 'Ed25519VerificationKey2020',
						controller: did,
						publicKeyJwk: jwk,
					});
				}
			});
		}

		return {
			'@context': ['https://www.w3.org/ns/did/v1', 'https://w3id.org/security/suites/ed25519-2020/v1'],
			id: did,
			verificationMethod: verificationMethods,
			authentication: verificationMethods.map(m => m.id),
			assertionMethod: verificationMethods.map(m => m.id),
			capabilityInvocation: verificationMethods.map(m => m.id),
			capabilityDelegation: verificationMethods.map(m => m.id),
			service: [
				{
					id: `${did}#governance`,
					type: 'DAO-Governance-Service',
					serviceEndpoint: 'https://dao.asppibra.org/api/governance',
				},
			],
		};
	}

	private static toJWK(publicKeyStr: string) {
		if (!publicKeyStr) return null;
		try {
			const pubArray = JSON.parse(publicKeyStr);
			const base64url = btoa(String.fromCharCode(...pubArray))
				.replace(/\+/g, '-')
				.replace(/\//g, '_')
				.replace(/=/g, '');

			return {
				kty: 'OKP',
				crv: 'Ed25519',
				x: base64url,
				kid: 'key-1',
			};
		} catch (e) {
			return null;
		}
	}
}
