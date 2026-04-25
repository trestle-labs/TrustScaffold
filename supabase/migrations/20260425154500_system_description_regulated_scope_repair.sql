update public.templates
set
  markdown_template = replace(
    markdown_template,
    '### Data Protection
- Data at rest is encrypted using AES-256 or equivalent.
- Data in transit is encrypted using TLS 1.2+.
- Backups are performed regularly and restore tests are conducted at least annually.

### Subservice Organizations',
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
{{/if}}

### Subservice Organizations'
  ),
  updated_at = now()
where slug = 'system-description'
  and markdown_template not like '%Protected health information (PHI) is identified as regulated data%';
