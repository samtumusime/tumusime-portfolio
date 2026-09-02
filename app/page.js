import { getPortfolioData } from '@/lib/publicData';
import Nav from '@/components/public/Nav';
import Hero from '@/components/public/Hero';
import Stats from '@/components/public/Stats';
import About from '@/components/public/About';
import Skills from '@/components/public/Skills';
import Experience from '@/components/public/Experience';
import Projects from '@/components/public/Projects';
import Certificates from '@/components/public/Certificates';
import Awards from '@/components/public/Awards';
import CV from '@/components/public/CV';
import Contact from '@/components/public/Contact';
import Footer from '@/components/public/Footer';
import ScrollEffects from '@/components/public/ScrollEffects';
import ScrollProgress from '@/components/public/ScrollProgress';
import BackToTop from '@/components/public/BackToTop';

export const revalidate = 0; // always reflect the latest admin edits

export default async function HomePage() {
  const { profile, skillGroups, experience, projects, certificates, awards, cv } =
    await getPortfolioData();

  return (
    <>
      <ScrollProgress />
      <Nav name={profile?.full_name} cvUrl={cv?.file_url} />
      <main>
        <Hero profile={profile} />
        <Stats
          certificatesCount={certificates.length}
          projectsCount={projects.length}
          skillGroupsCount={skillGroups.length}
          experienceCount={experience.length}
        />
        <About profile={profile} />
        <Skills skillGroups={skillGroups} />
        <Experience experience={experience} />
        <Projects projects={projects} />
        <Certificates certificates={certificates} />
        <Awards awards={awards} />
        <CV cv={cv} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
      <BackToTop />
      <ScrollEffects />
    </>
  );
}
