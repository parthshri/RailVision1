import { PageTransition } from "@/components/PageTransition";
import { AffiliateTracker } from "@/components/AffiliateTracker";
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
  <AffiliateTracker />
}
