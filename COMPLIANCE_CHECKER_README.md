# App Store Compliance Checker - Setup Guide

## Overview

The App Store Compliance Checker is a powerful AI-powered tool that analyzes mobile applications for compliance with Google Play Store and Apple App Store guidelines. It identifies violations, pinpoints problematic code locations, and provides actionable suggestions for fixes.

## Features

- **Multi-Platform Support**: Android, iOS, React Native, and Flutter applications
- **Dual Upload Methods**: Upload ZIP files or provide Git repository URLs
- **AI-Powered Analysis**: Uses Google's Gemini AI for intelligent code analysis
- **Comprehensive Rules**: Checks against 20+ compliance rules for both stores
- **Detailed Reports**: Get specific code locations, line numbers, and fix suggestions
- **Beautiful UI**: Modern, responsive interface with dark mode support

## Setup Instructions

### 1. Install Dependencies

Dependencies have already been installed:
- `ai` - Vercel AI SDK
- `@ai-sdk/google` - Google AI provider
- `jszip` - ZIP file handling

### 2. Get Google AI API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add:

```env
GOOGLE_AI_API_KEY=your_google_ai_studio_api_key_here
```

**Important**: Never commit this file to version control. It's already in `.gitignore`.

### 4. Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/compliance` to use the Compliance Checker.

## Usage Guide

### Step 1: Select Platform & Store

Choose your application platform:
- Android
- iOS
- React Native
- Flutter

The target store will be auto-selected based on your platform, or you can choose manually for cross-platform frameworks.

### Step 2: Upload Your Application

**Option A - Upload Files:**
- Upload a ZIP archive of your entire project
- Or upload specific configuration files (AndroidManifest.xml, Info.plist, etc.)

**Option B - Repository Link:**
- Provide a public Git repository URL (GitHub, GitLab, Bitbucket)
- Specify the branch (default: main)
- The system will fetch and analyze your code

### Step 3: Run Analysis

Click "Analyze Compliance" to start the AI-powered analysis. The system will:
1. Extract and parse your configuration files
2. Apply platform-specific compliance rules
3. Use AI to identify violations
4. Generate detailed reports with suggestions

### Step 4: Review Results

The results page displays:
- **Compliance Score**: 0-100 score based on violations
- **Violations by Severity**: Critical, High, Medium, Low
- **Detailed Cards**: Each violation includes:
  - Rule description
  - Code location with line numbers
  - Code snippet showing the issue
  - AI-generated fix suggestion
  - Optional replacement code
  - Official documentation links
- **AI Insights**: Overall assessment and recommendations
- **Download Report**: Export results as JSON

## Compliance Rules Covered

### Google Play Store (11 Rules)

1. **Target SDK Version**: Must target API 33+ (Android 13)
2. **Dangerous Permissions**: Proper permission declarations
3. **Data Safety Section**: Accurate data collection disclosure
4. **Privacy Policy**: Required for apps handling personal data
5. **Data Encryption**: Encrypt sensitive data
6. **Background Location**: Justify background location usage
7. **Package Visibility**: Declare package queries for API 30+
8. **Third-Party SDKs**: SDK compliance verification
9. **Accessibility**: Content descriptions for UI elements
10. **Network Security**: HTTPS and security configuration
11. **And more...**

### iOS App Store (11 Rules)

1. **Minimum iOS Version**: Support reasonable iOS versions
2. **Privacy Manifest**: Required PrivacyInfo.xcprivacy file
3. **App Tracking Transparency**: Request tracking permission
4. **Privacy Usage Descriptions**: Descriptions for sensitive features
5. **App Transport Security**: HTTPS for network connections
6. **Background Modes**: Justify background execution
7. **Data Collection Declaration**: Accurate App Store Connect disclosure
8. **Third-Party SDK Tracking**: SDK privacy compliance
9. **Sign in with Apple**: Required if offering third-party sign-in
10. **Encryption Export**: Export compliance documentation
11. **Required Reason API**: Justify use of specific APIs

## File Structure

```
auditly-frontend/
├── app/
│   ├── compliance/
│   │   ├── page.tsx                    # Main compliance checker page
│   │   └── results/
│   │       └── page.tsx                # Results display page
│   └── api/
│       └── compliance/
│           ├── analyze/route.ts        # AI analysis endpoint
│           ├── upload/route.ts         # File upload endpoint
│           └── fetch-repo/route.ts     # Repository fetch endpoint
├── components/
│   ├── platform-selector.tsx           # Platform selection UI
│   ├── upload-area.tsx                 # File upload UI
│   ├── source-link-input.tsx           # Repository URL input
│   ├── compliance-summary.tsx          # Summary card component
│   └── compliance-violation-card.tsx   # Violation card component
├── lib/
│   ├── ai-client.ts                    # Google AI configuration
│   ├── ai-analyzer.ts                  # AI analysis logic
│   ├── compliance-rules.ts             # Rule definitions
│   ├── file-handler.ts                 # File processing
│   └── source-fetcher.ts               # Repository fetching
└── types/
    └── compliance.ts                    # TypeScript interfaces
```

## API Endpoints

### POST /api/compliance/upload
Upload and process application files.

**Request**: `multipart/form-data` with `file` field
**Response**: `{ success: boolean, projectStructure?: ProjectStructure }`

### POST /api/compliance/fetch-repo
Fetch code from a Git repository.

**Request**: `{ url: string, branch?: string }`
**Response**: `{ success: boolean, projectStructure?: ProjectStructure }`

### POST /api/compliance/analyze
Analyze code for compliance violations.

**Request**: `{ projectStructure: ProjectStructure, store: Store }`
**Response**: `ComplianceResult` object

## Troubleshooting

### "AI service is not configured" Error
- Ensure `GOOGLE_AI_API_KEY` is set in `.env.local`
- Restart the development server after adding the key

### "Could not detect platform" Error
- Ensure your upload includes recognizable config files
- For Android: AndroidManifest.xml or build.gradle
- For iOS: Info.plist or Podfile
- For React Native: package.json with react-native dependency
- For Flutter: pubspec.yaml

### Repository Fetch Fails
- Ensure the repository is public (private repo support is limited)
- Verify the URL is correct and accessible
- Check that the branch name is correct

### Analysis Takes Too Long
- Large projects may take 30-60 seconds to analyze
- The AI needs time to process all code and rules
- Consider uploading only essential configuration files for faster analysis

## Privacy & Security

- Your code is sent to Google AI Studio for analysis
- Code is not stored permanently on our servers
- Analysis is done in real-time and results are stored only in browser session storage
- Repository URLs are not logged or stored

## Future Enhancements

Potential improvements for future versions:
- PDF report generation
- Historical analysis tracking
- Automated fix application
- CI/CD integration
- Private repository support with authentication
- Support for more app stores (Amazon Appstore, Samsung Galaxy Store)
- Custom rule creation

## Support

For issues or questions:
1. Check the browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure you're using a compatible file format
4. Review the official documentation links provided in violation cards

## Credits

Built with:
- Next.js 16
- Vercel AI SDK
- Google Gemini AI
- Tailwind CSS
- Radix UI Components

---

**Note**: This tool provides guidance based on AI analysis and should not replace thorough manual review and official app store guidelines. Always refer to official documentation before submission.

