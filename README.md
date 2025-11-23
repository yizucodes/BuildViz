# BuildViz

**Professional architectural renderings with itemized construction cost estimates in 60 seconds.**

BuildViz generates photorealistic architectural visualizations combined with detailed cost breakdowns. Simply input your building specifications, and get instant professional renderings with accurate construction cost estimates.

## Features

- 🏗️ **Instant Visualization**: Photorealistic architectural renderings in under 60 seconds
- 💰 **Cost Estimation**: Itemized construction costs with regional adjustments
- 🎨 **Design Interpretations**: Get 3 AI-generated design options from a text description
- 🚦 **Permit Analysis**: AI-powered permit considerations based on location
- 📊 **Professional Output**: Publication-ready results with detailed breakdowns
- ⚡ **Fast & Simple**: Intuitive interface, no architectural expertise required

## 📹 [Watch the demo video](https://www.youtube.com/watch?v=F0rx_DTFUo8)

<img width="2374" height="1526" alt="image" src="https://github.com/user-attachments/assets/f48363d1-403a-4481-a6e6-928a973d1dca" />

## Tech Stack

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS
- **AI Services**: 
  - Anthropic Claude API (Sonnet 4.5) for cost estimation
  - FAL.ai FLUX for photorealistic rendering
  - NVIDIA Nemotron for design interpretation
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key
- FAL.ai API key
- NVIDIA API key (optional, for design interpretation feature)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd buildviz
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory:
```bash
VITE_ANTHROPIC_API_KEY=your_anthropic_key_here
VITE_FAL_KEY=your_fal_key_here
VITE_NVIDIA_API_KEY=your_nvidia_key_here  # Optional
```

**Getting API Keys:**
- **Anthropic**: Sign up at https://console.anthropic.com/
- **FAL.ai**: Sign up at https://fal.ai/ (Use coupon code: `lovefluxfal` for $100 credits)
- **NVIDIA**: Sign up at https://build.nvidia.com/

4. Run the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

## Usage

### Standard Flow

1. **Input Building Specifications**:
   - Building type (office, warehouse, residential, retail)
   - Number of stories
   - Square footage
   - Location (for regional cost adjustments)
   - Architectural style
   - Material quality

2. **Generate**: Click "Generate BuildViz" and wait 30-60 seconds

3. **Review Results**:
   - Professional architectural rendering
   - Itemized cost breakdown
   - Permit considerations
   - Total project cost and timeline

### Design Interpretation Flow

1. **Add Vision Description**: Optionally describe your vision (e.g., "Modern office that feels welcoming, not cold")

2. **Select from 3 Options**: AI generates 3 design interpretations with visualizations

3. **Choose Your Favorite**: Select the design that best matches your vision

4. **Get Full Analysis**: Receive cost estimates and permit considerations for your selected design

## Project Structure

```
buildviz/
├── src/
│   ├── components/
│   │   ├── InputForm.tsx              # Building specification form
│   │   ├── ResultDisplay.tsx          # Results with render + costs
│   │   ├── LoadingState.tsx           # Loading indicator
│   │   ├── InterpretationSelection.tsx # Design option selection
│   │   └── PermitConsiderations.tsx   # Permit analysis display
│   ├── services/
│   │   ├── claudeService.ts           # Cost estimation API
│   │   ├── fluxService.ts             # Rendering API
│   │   └── nemotronService.ts         # Design interpretation API
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces
│   ├── App.tsx                        # Main application component
│   └── main.tsx                       # Entry point
├── server.js                          # Express server for CORS
├── package.json
└── vite.config.ts
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import project to Vercel:
   - Go to https://vercel.com/new
   - Import your repository
   - Configure environment variables in Vercel dashboard:
     - `VITE_ANTHROPIC_API_KEY`
     - `VITE_FAL_KEY`
     - `VITE_NVIDIA_API_KEY` (optional)

3. Deploy!

Vercel will automatically detect the Vite configuration and deploy your app.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BuildViz Application                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   User Input    │    │   React App     │    │   Express       │         │
│  │   (Browser)     │◄──►│   (Vite)        │◄──►│   Server        │         │
│  │                 │    │                 │    │   (CORS Proxy)  │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│                                                                             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      AI Services Layer                              │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │                                                                     │    │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │    │
│  │  │   Claude        │  │   FLUX          │  │   Nemotron      │     │    │
│  │  │   (Cost Est.)   │  │   (Rendering)    │  │   (Interpretation)│     │    │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘     │    │
│  │                                                                     │    │
│  │  Anthropic API       FAL.ai API         NVIDIA API                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Workflow Flows

#### Standard Flow (30-60 seconds)
```
User Specs → FLUX + Claude (Parallel) → Result Display
               ↓
         Permit Analysis
```

#### Interpretation Flow (85-100 seconds)
```
Vision Description → Nemotron → 3 Interpretations
                       ↓
                FLUX (3x Parallel) → Selection Grid
                       ↓
                User Selects → Claude + Permit → Final Result
```

### Service Details

#### Cost Estimation (Claude)
The Claude API analyzes building specifications and generates itemized construction costs considering:
- Regional cost multipliers (San Francisco 1.4x, NYC 1.3x, Texas 0.8x, etc.)
- Material quality adjustments (premium +25%, basic -15%)
- Current 2024 construction market rates
- Industry-standard cost breakdowns

#### Architectural Rendering (FLUX)
FLUX generates photorealistic visualizations based on:
- Building specifications and dimensions
- Architectural style preferences
- Professional architectural photography standards
- Contextual urban settings

#### Design Interpretation (Nemotron)
NVIDIA Nemotron analyzes your vision description and generates 3 distinct architectural interpretations, each with:
- Unique design approach
- Material recommendations
- Aesthetic characteristics
- Visual representation

## Limitations & Disclaimers

- Cost estimates are preliminary and for feasibility analysis only
- Actual construction costs may vary by 20-40% based on market conditions, site-specific factors, and final design specifications
- Permit analysis is based on typical requirements and should be verified with local planning departments

## License

MIT

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ for architects, contractors, and developers who need fast, professional feasibility studies.**
