import type { Audit } from './audit.model';
import type {
  FindAuditOptions,
  FindAuditPayload,
  QueryAuditsPayload,
  RegisterAuditPayload,
  UpdateAuditPayload,
} from './audit.payload';

export interface IAuditService {
  ///////////////////////////////////
  //             Create
  ///////////////////////////////////

  registerAudit(payload: RegisterAuditPayload): Promise<Audit>;

  ///////////////////////////////////
  //              Find
  ///////////////////////////////////

  findAudit(payload: FindAuditPayload, options?: FindAuditOptions): Promise<Audit | null>;

  getAudit(...args: Parameters<IAuditService['findAudit']>): Promise<Audit>;

  queryAudits(payload: QueryAuditsPayload, options?: FindAuditOptions): Promise<Audit[]>;

  ///////////////////////////////////
  //             Update
  ///////////////////////////////////

  updateAudit(payload: UpdateAuditPayload): Promise<void>;
}
