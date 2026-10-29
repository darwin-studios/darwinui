# Contributing

Use Node 22 and pnpm 10.12.1. Run `pnpm install`, `pnpm build`, `pnpm test`, and `pnpm audit:public`. Consumer and browser checks are additional release gates.

Keep core free of React and product imports. Keep backend behavior outside presentation components. Include keyboard and error-state coverage for interactive changes. Public API changes need a Changeset. Describe the user problem and validation in each pull request.

The canonical source is maintained as a distribution in Darwin's monorepo. Public pull requests are welcome. Maintainers import accepted commits with contributor attribution, test the Navigator integration, and export the reviewed result back here. Synchronization must stop on divergence. Do not force-push community contributions away.

A maintainer must review asset licenses and public contents before export. Do not add account data, private fixtures, credentials, or product-only artwork.
