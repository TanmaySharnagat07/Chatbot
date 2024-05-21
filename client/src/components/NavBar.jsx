import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-scroll';

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll);

    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      { threshold: [0.3, 0.7] }
    );

    sections.forEach(section => observer.observe(section));

    return () => {
      window.removeEventListener("scroll", onScroll);
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  return (
    <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav" className="mt-3 mb-6 text-bold">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="home"
              smooth={true}
              duration={500}
              className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="known"
              smooth={true}
              duration={500}
              className={activeLink === 'known' ? 'active navbar-link' : 'navbar-link'}
            >
              Knowledge Explorer
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="dexplorer"
              smooth={true}
              duration={500}
              className={activeLink === 'dexplorer' ? 'active navbar-link' : 'navbar-link'}
            >
              Data Explorer
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
