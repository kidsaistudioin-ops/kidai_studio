import LearningDashboard from '@/components/learn/LearningDashboard';
// Sabhi visual components ko link karna taaki Next.js inko bundle kar le
import '@/components/learn/AnimMath';
import '@/components/learn/EnglishBuilder';
import '@/components/learn/HindiVisual';
import '@/components/learn/ScienceVisual';

export default function LearnPage() {
  return <LearningDashboard />;
}