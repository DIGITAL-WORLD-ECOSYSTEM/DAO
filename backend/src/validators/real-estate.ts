import { z } from 'zod';

export const propertyCreateSchema = z.object({
	title: z.string().min(5),
	propertyType: z.enum(['urban', 'rural', 'commercial', 'land']),
	registrationNumberRgi: z.string().optional(),
	iptuNumber: z.string().optional(),
	notes: z.string().optional(),
});

export const propertyUpdateSchema = z.object({
	title: z.string().min(5).optional(),
	propertyType: z.enum(['urban', 'rural', 'commercial', 'land']).optional(),
	status: z.enum(['draft', 'under_review', 'approved', 'registered', 'tokenized', 'sold', 'rented', 'archived']).optional(),
	registrationNumberRgi: z.string().optional(),
	iptuNumber: z.string().optional(),
	workflowStep: z
		.enum([
			'digitalization',
			'documents_uploaded',
			'technical_review',
			'legal_review',
			'cartorio_submission',
			'cartorio_approved',
			'ipfs_published',
			'blockchain_registered',
			'completed',
		])
		.optional(),
	isTokenized: z.boolean().optional(),
	isFeatured: z.boolean().optional(),
	notes: z.string().optional(),
});

export const locationSchema = z.object({
	street: z.string().optional(),
	number: z.number().optional(),
	block: z.string().optional(),
	lot: z.string().optional(),
	neighborhood: z.string().optional(),
	city: z.string(),
	state: z.string(),
	zipCode: z.string().optional(),
	country: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	utmZone: z.string().optional(),
	utmMeridian: z.string().optional(),
	utmEasting: z.number().optional(),
	utmNorthing: z.number().optional(),
	geodeticSystem: z.string().optional(),
	zoningCode: z.string().optional(),
	zoningDescription: z.string().optional(),
});

export const landSchema = z.object({
	totalAreaM2: z.number().optional(),
	perimeterM: z.number().optional(),
	terrainType: z.string().optional(),
	frontageM: z.number().optional(),
	depthRightM: z.number().optional(),
	depthLeftM: z.number().optional(),
	rearM: z.number().optional(),
	boundaryFront: z.string().optional(),
	boundaryRight: z.string().optional(),
	boundaryLeft: z.string().optional(),
	boundaryRear: z.string().optional(),
});

export const pricingSchema = z.object({
	priceType: z.enum(['sale', 'rent', 'appraisal']),
	amountBrlCents: z.number().int().positive(),
	amountToken: z.number().int().optional(),
	currency: z.string().optional(),
	paymentMethod: z.string().optional(),
	terms: z.string().optional(),
	source: z.string().optional(),
	notes: z.string().optional(),
});
