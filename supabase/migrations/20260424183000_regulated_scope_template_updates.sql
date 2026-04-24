-- Add explicit regulated-scope language for PHI and cardholder data environment fields,
-- plus framework-specific HIPAA administrative safeguard and PCI segmentation sections.

UPDATE public.templates
SET markdown_template = replace(
  markdown_template,
  '{{#if stores_customer_pii}}
{{organization_name}} stores customer personal information and applies heightened access and retention controls.
{{/if}}
{{#if has_subprocessors}}
Approved subprocessors handling sensitive data are listed in the vendor register.
{{/if}}',
  '{{#if stores_customer_pii}}
{{organization_name}} stores customer personal information and applies heightened access and retention controls.
{{/if}}
{{#if stores_phi}}
{{organization_name}} handles protected health information (PHI) and applies regulated healthcare safeguards, minimum-necessary access controls, and enhanced incident-handling requirements.
{{/if}}
{{#if has_cardholder_data_environment}}
{{organization_name}} operates an in-scope cardholder data environment (CDE) and restricts cardholder-data access, transmission, and storage to approved systems within that boundary.
{{/if}}
{{#if has_subprocessors}}
Approved subprocessors handling sensitive data are listed in the vendor register.
{{/if}}'
)
WHERE slug = 'data-classification-handling-policy';

UPDATE public.templates
SET markdown_template = replace(
  markdown_template,
  '## Retention
Personal data is retained according to documented legal, contractual, and operational requirements.',
  '## Retention
Personal data is retained according to documented legal, contractual, and operational requirements.

{{#if stores_phi}}
## Healthcare-Regulated Information
Where {{primary_product_name}} handles protected health information, privacy and security obligations for regulated healthcare data are incorporated into notice, access, retention, and incident-response procedures.

## HIPAA Administrative Safeguards
- Workforce members with access to PHI are granted access based on role and business need.
- Access changes and terminations are coordinated through {{hris_provider}} and identity controls administered through {{idp_provider}}.
- Security awareness training and sanctions processes apply to personnel handling regulated healthcare information.
- Security incidents involving PHI are escalated through {{ticketing_system}} and {{on_call_tool}} for investigation, containment, and documentation.
- Vendors with PHI access are reviewed through the vendor-management process and must satisfy contractual and assurance expectations before use.
{{/if}}'
)
WHERE slug = 'privacy-notice-consent-policy';

UPDATE public.templates
SET markdown_template = replace(
  markdown_template,
  '### Data Protection
- Data at rest is encrypted using AES-256 or equivalent.
- Data in transit is encrypted using TLS 1.2+.
- Backups are performed regularly and restore tests are conducted at least annually.
{{#if stores_phi}}
- Protected health information (PHI) is identified as regulated data requiring heightened access restrictions, audit logging, and workforce handling controls.
{{/if}}
{{#if has_cardholder_data_environment}}
- The cardholder data environment (CDE) is explicitly defined and protected through boundary controls, approved payment-system access, and monitored administrative activity.
{{/if}}',
  '### Data Protection
- Data at rest is encrypted using AES-256 or equivalent.
- Data in transit is encrypted using TLS 1.2+.
- Backups are performed regularly and restore tests are conducted at least annually.
{{#if stores_phi}}
- Protected health information (PHI) is identified as regulated data requiring heightened access restrictions, audit logging, and workforce handling controls.
{{/if}}
{{#if has_cardholder_data_environment}}
- The cardholder data environment (CDE) is explicitly defined and protected through boundary controls, approved payment-system access, and monitored administrative activity.
{{/if}}

{{#if has_cardholder_data_environment}}
### PCI Segmentation Responsibilities
- The cardholder data environment boundary is documented and reviewed when infrastructure, payment flows, or connected services change.
- Inbound and outbound connections to the CDE are restricted to approved services, ports, and administrative paths.
- Administrative access into the CDE requires strong authentication, approved access methods, and logging.
- Changes affecting segmentation controls are reviewed through {{vcs_provider}} change-management workflows before deployment.
- Connected vendors and service providers that could affect the CDE are reviewed through the vendor-management process.
{{/if}}'
)
WHERE slug = 'system-description';