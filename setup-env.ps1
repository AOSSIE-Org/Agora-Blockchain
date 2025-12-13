# Agora Blockchain - Environment Setup Script (PowerShell)
# This script helps you quickly set up environment files for local development

Write-Host "🚀 Agora Blockchain - Environment Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to create blockchain .env file
function Setup-BlockchainEnv {
    Write-Host "Setting up blockchain environment..." -ForegroundColor Yellow
    
    if (Test-Path "blockchain\.env") {
        $overwrite = Read-Host "⚠️  blockchain\.env already exists! Do you want to overwrite it? (y/n)"
        if ($overwrite -ne "y") {
            Write-Host "Skipping blockchain\.env"
            return
        }
    }
    
    $localDev = Read-Host "Are you setting up for local development? (y/n)"
    
    if ($localDev -eq "y") {
        $content = @"
# Local Development Configuration
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RPC_URL_SEPOLIA=http://localhost:8545
RPC_URL_FUJI=http://localhost:8545
RPC_URL_AMOY=http://localhost:8545
RPC_URL_BSC=http://localhost:8545
ETHERSCAN_KEY=dummy_key_for_local_dev
"@
        Set-Content -Path "blockchain\.env" -Value $content
        Write-Host "✅ Created blockchain\.env with local development values" -ForegroundColor Green
    }
    else {
        Copy-Item "blockchain\.env.example" "blockchain\.env"
        Write-Host "✅ Created blockchain\.env from example" -ForegroundColor Green
        Write-Host "⚠️  Please edit blockchain\.env with your credentials" -ForegroundColor Yellow
    }
}

# Function to create client .env file
function Setup-ClientEnv {
    Write-Host "Setting up client environment..." -ForegroundColor Yellow
    
    if (Test-Path "client\.env") {
        $overwrite = Read-Host "⚠️  client\.env already exists! Do you want to overwrite it? (y/n)"
        if ($overwrite -ne "y") {
            Write-Host "Skipping client\.env"
            return
        }
    }
    
    $localDev = Read-Host "Are you setting up for local development? (y/n)"
    
    if ($localDev -eq "y") {
        $content = @"
# Local Development Configuration
NEXT_PUBLIC_SEPOLIA_RPC_URL=http://localhost:8545
NEXT_PUBLIC_AMOY_RPC_URL=http://localhost:8545
NEXT_PUBLIC_FUJI_RPC_URL=http://localhost:8545
NEXT_PUBLIC_PINATA_JWT=dummy_jwt_for_local_dev
"@
        Set-Content -Path "client\.env" -Value $content
        Write-Host "✅ Created client\.env with local development values" -ForegroundColor Green
        Write-Host "⚠️  Note: IPFS uploads won't work with dummy Pinata JWT" -ForegroundColor Yellow
    }
    else {
        Copy-Item "client\.env.example" "client\.env"
        Write-Host "✅ Created client\.env from example" -ForegroundColor Green
        Write-Host "⚠️  Please edit client\.env with your credentials" -ForegroundColor Yellow
    }
}

# Main execution
Write-Host "This script will help you set up environment variables."
Write-Host ""

# Check if .env.example files exist
if (-not (Test-Path "blockchain\.env.example") -or -not (Test-Path "client\.env.example")) {
    Write-Host "⚠️  Warning: .env.example files not found!" -ForegroundColor Yellow
    Write-Host "Make sure you're running this script from the project root directory."
    exit 1
}

Setup-BlockchainEnv
Write-Host ""
Setup-ClientEnv

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Environment setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Start blockchain: cd blockchain ; npx hardhat node"
Write-Host "2. Start frontend: cd client ; npm run dev"
Write-Host "3. Open http://localhost:3000"
Write-Host ""
Write-Host "For detailed instructions, see ENVIRONMENT_SETUP.md"
Write-Host "========================================" -ForegroundColor Cyan
