update public.templates
set
  markdown_template = $$---
title: Acceptable Use and Code of Conduct Policy
slug: acceptable-use-code-of-conduct-policy
tsc_category: Security
criteria_mapped:
  - CC1
  - CC2
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

# Acceptable Use and Code of Conduct Policy

## Statement
{{organization_name}} expects workforce members to use company systems responsibly, lawfully, ethically, and in a manner consistent with company values and security obligations.

## Scope
This policy applies to {{acceptable_use_scope}}. It covers all company systems, including {{primary_product_name}}, {{idp_provider}}, company-issued devices, source code repositories, collaboration tools, ticketing systems, and approved storage locations used to process or access company or customer data.

## Acceptable Use
- Company systems are provided for authorized business purposes{{#if permits_limited_personal_use}}, with limited incidental personal use permitted only when it does not interfere with work, violate law or policy, or create security, confidentiality, or availability risk{{/if}}.
- Workforce members must protect credentials, MFA factors, access tokens, and company-issued devices from unauthorized use.
- Workforce members must use company systems in a professional manner and may not harass, threaten, discriminate, or misuse company communication channels.
{{#if requires_approved_software}}
- Only approved software, services, repositories, and storage locations may be used to create, process, transmit, or store company or customer data.
{{/if}}
{{#if restricts_company_data_to_approved_systems}}
- Company and customer data must remain in approved systems and may not be copied into personal accounts, unmanaged devices, or unapproved artificial intelligence, file-sharing, messaging, or storage services.
{{/if}}

## Prohibited Use
Workforce members may not use company systems to:

- Perform unlawful activity, harassment, discrimination, retaliation, or other conduct inconsistent with the code of conduct.
- Attempt to bypass access controls, logging, security monitoring, endpoint protection, or other security safeguards.
- Share accounts, passwords, MFA factors, API keys, session tokens, or privileged access with another person.
- Access, disclose, modify, download, or transmit company, customer, employee, or vendor data without authorization and business need.
- Install unauthorized software, connect unmanaged devices, or introduce malware, unauthorized scanning tools, or unapproved automation into company environments.

## Device and Data Handling
- Company-issued devices must be protected with screen locks, encryption where supported, and current security updates.
{{#if has_mdm}}
- Company-managed devices are enrolled in {{mdm_tool}} or an equivalent management process for baseline configuration, remote lock, and remote wipe support.
{{else}}
- {{organization_name}} shall establish a device-management process for enforcing baseline device controls as the program matures.
{{/if}}
{{#if has_endpoint_protection}}
- Endpoint protection is provided through {{endpoint_protection_tool}} or an equivalent protective control.
{{else}}
- {{organization_name}} shall establish endpoint protection for company-managed devices as the program matures.
{{/if}}
{{#if requires_lost_device_reporting}}
- Lost, stolen, or suspected-compromised devices must be reported to {{security_report_channel}} within {{lost_device_report_sla_hours}} hours so access can be reviewed and remote lock, wipe, or containment actions can be initiated.
{{/if}}

## Security Reporting
Workforce members must promptly report suspected phishing, credential exposure, policy violations, unauthorized access, lost devices, suspicious activity, or other security concerns to {{security_report_channel}}.

## Monitoring and Enforcement
{{#if monitors_company_systems}}
Company systems, networks, devices, repositories, and logs may be monitored for security, compliance, operational, and incident-response purposes, subject to applicable law.
{{else}}
{{organization_name}} reviews security-relevant activity as needed for incident response, investigation, and compliance purposes, subject to applicable law.
{{/if}}
{{#if has_disciplinary_procedures}}
Violations of this policy may result in disciplinary action up to and including access removal, termination, contract termination, and legal action.
{{else}}
{{organization_name}} shall define disciplinary procedures for policy violations and document how violations are reviewed and remediated.
{{/if}}

## Acknowledgement
{{#if (eq acknowledgement_cadence 'not-yet')}}
{{organization_name}} shall establish an onboarding and periodic acknowledgement process for this policy.
{{else}}
All personnel acknowledge these expectations during onboarding and during {{acknowledgement_cadence}} policy review cycles.
{{/if}}
$$,
  default_variables = '{
    "organization_name": "Example Corp",
    "effective_date": "2026-04-18",
    "policy_version": "v0.1",
    "primary_product_name": "Example Cloud",
    "idp_provider": "Okta",
    "acceptable_use_scope": "employees, contractors, consultants, temporary workers, and any other workforce members with access to company systems",
    "permits_limited_personal_use": false,
    "requires_approved_software": true,
    "restricts_company_data_to_approved_systems": true,
    "has_mdm": true,
    "mdm_tool": "Jamf",
    "has_endpoint_protection": true,
    "endpoint_protection_tool": "Microsoft Defender for Endpoint",
    "requires_lost_device_reporting": true,
    "lost_device_report_sla_hours": 24,
    "security_report_channel": "security@example.com",
    "monitors_company_systems": true,
    "has_disciplinary_procedures": true,
    "acknowledgement_cadence": "hire-and-annual"
  }'::jsonb,
  updated_at = now()
where slug = 'acceptable-use-code-of-conduct-policy';
