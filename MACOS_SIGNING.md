# macOS Signing & Notarization

To enable a seamless "Double-Click" experience on macOS, follow these steps once you have an Apple Developer Account.

## 1. Prepare Secrets
Add the following to your GitHub Repository Secrets:
- `APPLE_CERTIFICATE`: Base64 string of your `.p12` certificate.
- `APPLE_CERTIFICATE_PASSWORD`: Password for the certificate.
- `APPLE_SIGNING_IDENTITY`: The identity name (e.g., "Developer ID Application: Your Name (TEAMID)").
- `APPLE_ID`: Your Apple ID email.
- `APPLE_PASSWORD`: App-specific password from appleid.apple.com.
- `APPLE_TEAM_ID`: Your 10-character Team ID.

## 2. Update Workflow
Paste the following block back into `.github/workflows/release.yml` under the `env` section of the `build-the-app` step:

```yaml
          APPLE_CERTIFICATE: ${{ secrets.APPLE_CERTIFICATE }}
          APPLE_CERTIFICATE_PASSWORD: ${{ secrets.APPLE_CERTIFICATE_PASSWORD }}
          APPLE_SIGNING_IDENTITY: ${{ secrets.APPLE_SIGNING_IDENTITY }}
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_PASSWORD: ${{ secrets.APPLE_PASSWORD }}
          APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
```
