# Environment UAT — Pure On-Prem / Self-Hosted Gap

## Current State

The current wizard UI includes self-hosted and physical-hosting controls, but the validation schema still requires at least one cloud provider to be selected.

That means a true pure on-prem or pure self-hosted completion path is not currently a valid end-to-end UAT scenario.

## Evidence From Current Wizard Constraints

- The Infrastructure step asks for `Cloud providers (select all that apply)`.
- The schema requires `cloudProviders` to contain at least one value.
- Some UI content exists for `watchedHostsOwnHardware && watchedCloudProviders.length === 0`, but that state cannot currently satisfy the full schema for successful completion.

## What To Test Today

Until the schema changes, treat on-prem validation as a product-gap review instead of a full UAT pass:

1. Check `We host our own hardware (on-premises / colocation)`.
2. Try leaving all cloud providers unchecked.
3. Confirm the UI surfaces the self-hosted-only controls.
4. Confirm the form still blocks progression because no cloud provider is selected.

Expected outcome today:

- Self-hosted control sections may render.
- The form should not validate as a complete path.
- This should be tracked as a product limitation if pure on-prem support is intended.

## Recommendation

If pure on-prem is an intended supported environment, the wizard should be changed so that one of these becomes true:

1. `cloudProviders` can be empty when self-hosted hardware is selected.
2. A first-class `Self-hosted` completion path is implemented and documented.

Until then, do not represent pure on-prem as a supported full UAT environment.
