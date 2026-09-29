import {
  AuditRepository,
  AuditInput,
} from '../repositories/auditRepository.ts';

export class AuditService {
  private repository = new AuditRepository();

  async getAudits() {
    return this.repository.findAll();
  }

  async createAudit(input: AuditInput) {
    return this.repository.create(input);
  }
}