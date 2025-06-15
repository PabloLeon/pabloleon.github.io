<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { Menu, X } from 'lucide-svelte';
  import { personalInfo } from '$lib/config';
  import Button from './Button.svelte';
  import IconButton from './IconButton.svelte';
  import SocialIcons from './SocialIcons.svelte';

  let mobileMenuOpen = $state(false);
  let activeSection = $state('home');

  let isHomePage = $derived($page.url.pathname === '/');

  function handleNavigation(sectionId: string) {
    if (isHomePage) {
      // If on home page, scroll to section
      scrollToSection(sectionId);
    } else {
      // If on other pages, navigate to home page with hash
      window.location.href = `/#${sectionId}`;
    }
  }

  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    mobileMenuOpen = false;
  }

  function goHome() {
    if (isHomePage) {
      scrollToSection('home');
    } else {
      window.location.href = '/';
    }
  }

  onMount(() => {
    const handleScroll = () => {
      if (!isHomePage) return;
      
      const sections = ['home', 'about', 'projects', 'writing', 'publications'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            activeSection = section;
            break;
          }
        }
      }
    };

    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<header class="fixed top-0 left-0 right-0 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 z-50">
  <div class="flex items-center justify-between px-4 sm:px-8 py-4 max-w-7xl mx-auto">
    <button
      onclick={goHome}
      class="text-xl sm:text-2xl font-bold text-blue-600 tracking-wide"
    >
      {personalInfo.name.toUpperCase()}
    </button>

    <!-- Desktop Navigation -->
    <div class="hidden md:flex items-center gap-8">
      <nav class="flex items-center gap-6">
        <Button variant="nav-link" active={activeSection === 'about'} onclick={() => handleNavigation('about')}>
          about /
        </Button>
        <Button variant="nav-link" active={activeSection === 'projects'} onclick={() => handleNavigation('projects')}>
          projects /
        </Button>
        <!-- <Button variant="nav-link" active={activeSection === 'writing'} onclick={() => handleNavigation('writing')}>
          writing /
        </Button> -->
        <Button variant="nav-link" active={activeSection === 'publications'} onclick={() => handleNavigation('publications')}>
          publications /
        </Button>
      </nav>

      <SocialIcons size="md" />
    </div>

    <!-- Mobile Menu Button -->
    <IconButton
      variant="ghost"
      size="md"
      onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
      class="md:hidden"
    >
      {#if mobileMenuOpen}
        <X class="w-6 h-6" />
      {:else}
        <Menu class="w-6 h-6" />
      {/if}
    </IconButton>
  </div>

  <!-- Mobile Navigation -->
  {#if mobileMenuOpen}
    <div class="md:hidden bg-gray-50 border-t border-gray-200">
      <nav class="flex flex-col p-4 space-y-4">
        <Button variant="nav-link" active={activeSection === 'about'} onclick={() => handleNavigation('about')} class="justify-start">
          about
        </Button>
        <Button variant="nav-link" active={activeSection === 'projects'} onclick={() => handleNavigation('projects')} class="justify-start">
          projects
        </Button>
        <!-- <Button variant="nav-link" active={activeSection === 'writing'} onclick={() => handleNavigation('writing')} class="justify-start">
          writing
        </Button> -->
        <Button variant="nav-link" active={activeSection === 'publications'} onclick={() => handleNavigation('publications')} class="justify-start">
          publications
        </Button>

        <div class="pt-4 border-t border-gray-200">
          <SocialIcons size="sm" />
        </div>
      </nav>
    </div>
  {/if}
</header> 