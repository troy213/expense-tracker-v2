/**
 * Commit message linting — enforces Conventional Commits.
 * Ruleset: @commitlint/config-conventional
 *   - type must be one of: feat, fix, docs, style, refactor, perf, test,
 *     build, ci, chore, revert (lower-case)
 *   - subject must not be Title/Sentence/UPPER case and must not end with "."
 *   - breaking change via "feat!:" / "fix!:" or a "BREAKING CHANGE:" footer
 * Docs: https://www.conventionalcommits.org
 */
export default {
  extends: ['@commitlint/config-conventional'],
}
