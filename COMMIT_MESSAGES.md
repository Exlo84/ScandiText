# Git Commit Messages for v2.0.0 Release

## Main release commit:
```
feat: Release v2.0.0 - Nordisk Verktøysuite

- Transform ScandiText from text editor to complete Nordic tool suite
- Add tab-based navigation with 4 tools: Text Editor, Invoice, Social Media, Password
- Implement complete invoice generator with Norwegian VAT calculation
- Add donation support with Coffee and Vipps integration
- Preserve all existing text editing functionality
- Add responsive design and dark mode support
- Implement modular architecture with lazy loading

BREAKING CHANGE: None - full backward compatibility maintained

Closes: #[issue-number]
```

## Individual feature commits:
```
feat(tools): Add tab-based navigation system
feat(invoice): Implement complete invoice generator with VAT
feat(donation): Add Coffee and Vipps donation support
feat(ui): Add responsive design and dark mode support
docs: Update README.md for tool suite architecture
docs: Add comprehensive release notes for v2.0.0
```

## File changes summary:
- Modified: index.html (tab navigation, new tools, donation section)
- Modified: css/components.css (extensive styling for new tools)
- Modified: js/app.js (ToolManager integration)
- Added: js/tools/toolManager.js
- Added: js/tools/invoiceGenerator.js
- Added: vipps-qr.png
- Modified: README.md (complete rewrite for tool suite)
- Added: RELEASE_NOTES_v2.0.0.md
- Added: GITHUB_RELEASE_v2.0.0.md
