# BuildViz

**Professional architectural renderings with itemized construction cost estimates in 60 seconds.**

BuildViz is a web application that generates photorealistic architectural visualizations combined with detailed cost breakdowns. Simply input your building specifications, and get an instant professional rendering with accurate construction cost estimates.

## Features

- 🏗️ **Instant Visualization**: Photorealistic architectural renderings in under 60 seconds
- 💰 **Cost Estimation**: Itemized construction costs with regional adjustments
- 📊 **Professional Output**: Publication-ready results with detailed breakdowns
- ⚡ **Fast & Simple**: Intuitive interface, no architectural expertise required

## Tech Stack

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS
- **AI Services**: 
  - Anthropic Claude API (Sonnet 4.5) for cost estimation
  - FAL.ai FLUX for photorealistic rendering
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key
- FAL.ai API key

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
```

**Getting API Keys:**
- **Anthropic**: Sign up at https://console.anthropic.com/
- **FAL.ai**: Sign up at https://fal.ai/ (Use coupon code: `lovefluxfal` for $100 credits)

4. Run the development server:

```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

## Usage

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
   - Total project cost and timeline

4. **Export**: Download or share your results

## Example Projects

### Office Building
- Type: Office
- Stories: 3
- Size: 50,000 sq ft
- Location: San Francisco, CA
- Style: Modern Glass & Steel
- Quality: Standard

### Warehouse
- Type: Warehouse
- Stories: 1
- Size: 100,000 sq ft
- Location: Austin, TX
- Style: Industrial
- Quality: Basic

### Residential
- Type: Multi-Family Residential
- Stories: 5
- Size: 75,000 sq ft
- Location: Miami, FL
- Style: Modern Glass & Steel
- Quality: Premium

## Project Structure

```
buildviz/
├── src/
│   ├── components/
│   │   ├── InputForm.tsx       # Building specification form
│   │   ├── ResultDisplay.tsx   # Results with render + costs
│   │   └── LoadingState.tsx    # Loading indicator
│   ├── services/
│   │   ├── claudeService.ts    # Cost estimation API
│   │   └── fluxService.ts      # Rendering API
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── App.tsx                 # Main application component
│   ├── main.tsx               # Entry point
│   └── index.css              # Tailwind CSS
├── .env                        # Environment variables (not in git)
├── .env.example               # Example env file
├── package.json
├── tailwind.config.js
├── tsconfig.json
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

3. Deploy!

Vercel will automatically detect the Vite configuration and deploy your app.

## Technical Details

### Cost Estimation

The Claude API analyzes building specifications and generates itemized construction costs considering:
- Regional cost multipliers (San Francisco 1.4x, NYC 1.3x, Texas 0.8x, etc.)
- Material quality adjustments (premium +25%, basic -15%)
- Current 2024 construction market rates
- Industry-standard cost breakdowns

### Architectural Rendering

FLUX generates photorealistic visualizations based on:
- Building specifications and dimensions
- Architectural style preferences
- Professional architectural photography standards
- Contextual urban settings

## Limitations & Disclaimers

- Cost estimates are preliminary and for feasibility analysis only
- Actual construction costs may vary by 20-40% based on:
  - Market conditions
  - Site-specific factors
  - Final design specifications
  - Contractor pricing
  - Local regulations and permits

## Future Improvements

- [ ] PDF export with full report
- [ ] Multiple architectural style variations
- [ ] Interior renderings
- [ ] User accounts and project history
- [ ] Integration with real-time pricing APIs (RSMeans, Gordian)
- [ ] Multiple viewing angles (front, side, aerial)
- [ ] Mobile app

## License

MIT

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ for architects, contractors, and developers who need fast, professional feasibility studies.**
