import { eq, and } from 'drizzle-orm';
import { govProposals, govVotes } from '../../db/governance/tables';
import { Result } from '../../shared/kernel/Result';

export interface ProposalRecord {
  id?: number;
  creatorId: number;
  title: string;
  description: string;
  content?: string | null;
  status?: 'draft' | 'active' | 'passed' | 'rejected' | 'executed' | 'cancelled';
  type?: 'business' | 'parameter_change' | 'treasury_release' | 'membership_grant';
  quorum?: number;
}

export interface VoteRecord {
  id?: number;
  proposalId: number;
  voterId: number;
  support: boolean;
  votingPower?: number;
  reason?: string | null;
}

export class DrizzleGovernanceRepository {
  constructor(private db: any) {}

  async createProposal(proposal: ProposalRecord): Promise<Result<ProposalRecord>> {
    try {
      const [inserted] = await this.db
        .insert(govProposals)
        .values({
          creatorId: proposal.creatorId,
          title: proposal.title,
          description: proposal.description,
          content: proposal.content,
          status: proposal.status || 'active',
          type: proposal.type || 'business',
          quorum: proposal.quorum || 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return Result.ok({ ...proposal, id: inserted.id });
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }

  async getProposalById(id: number): Promise<Result<ProposalRecord>> {
    try {
      const [record] = await this.db
        .select()
        .from(govProposals)
        .where(eq(govProposals.id, id))
        .limit(1);

      if (!record) {
        return Result.fail('Proposal not found');
      }

      return Result.ok(record);
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }

  async castVote(vote: VoteRecord): Promise<Result<VoteRecord>> {
    try {
      const [inserted] = await this.db
        .insert(govVotes)
        .values({
          proposalId: vote.proposalId,
          voterId: vote.voterId,
          support: vote.support,
          votingPower: vote.votingPower || 1,
          reason: vote.reason,
          createdAt: new Date(),
        })
        .returning();

      return Result.ok({ ...vote, id: inserted.id });
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
