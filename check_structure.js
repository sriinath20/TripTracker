import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const requiredFiles = [
  'src/App.jsx',
  'src/index.css',
  'src/hooks/useTheme.js',
  'src/hooks/useTripStorage.js',
  'src/context/TripContext.jsx',
  'src/utils/appUtils.js',
  'src/utils/feedbackUtils.js',
  'src/components/ui/ModalOverlay.jsx',
  'src/components/layout/Navbar.jsx',
  'src/components/layout/TripMenuDrawer.jsx',
  'src/components/modals/TripSetupModal.jsx',
  'src/components/dashboard/BudgetOverview.jsx',
  'src/components/dashboard/ExpenseTable.jsx',
  'src/components/dashboard/Dashboard.jsx',
  'tailwind.config.js',
  'postcss.config.js',
];

console.log('🔍 Checking Project Structure...');
let errors = 0;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ MISSING: ${file}`);
    errors++;
  } else {
    console.log(`✅ Found: ${file}`);
  }
});

if (errors > 0) {
  console.log(`\n⚠️ Found ${errors} missing files. Please create them using the previous code blocks.`);
} else {
  console.log('\n🎉 Structure looks perfect! Try running "npm run build" now.');
}