import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Navigation } from './index'

describe('Navigation', () => {
  const navItems = [
    { label: 'Home', href: '/' },
    {
      label: 'Products',
      children: [
        { label: 'Web Development', href: '/products/web' },
        { label: 'Mobile Apps', href: '/products/mobile' },
      ],
    },
    { label: 'Contact', onClick: vi.fn() },
  ]
  const brand = { label: 'MyCompany', href: '/' }

  it('renders brand label', () => {
    render(
      <Navigation
        items={navItems}
        brand={brand}
      />
    )
    expect(screen.getByText('MyCompany')).toBeInTheDocument()
  })

  it('renders navigation items', () => {
    render(
      <Navigation
        items={navItems}
        brand={brand}
      />
    )
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('opens dropdown on click and shows children', () => {
    render(
      <Navigation
        items={navItems}
        brand={brand}
      />
    )
    const productsButton = screen.getByRole('button', { name: /products menu/i })
    fireEvent.click(productsButton)
    expect(screen.getByText('Web Development')).toBeInTheDocument()
    expect(screen.getByText('Mobile Apps')).toBeInTheDocument()
  })

  it('calls onClick for button item', () => {
    const contactClick = vi.fn()
    const items = [{ label: 'Contact', onClick: contactClick }]
    render(
      <Navigation
        items={items}
        brand={brand}
      />
    )
    fireEvent.click(screen.getByText('Contact'))
    expect(contactClick).toHaveBeenCalled()
  })

  it('renders without brand', () => {
    render(<Navigation items={navItems} />)
    expect(screen.queryByText('MyCompany')).not.toBeInTheDocument()
  })

  it('renders only links', () => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Docs', href: '/docs' },
    ]
    render(<Navigation items={items} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Docs')).toBeInTheDocument()
  })

  it('renders only buttons', () => {
    const items = [
      { label: 'Dashboard', onClick: vi.fn() },
      { label: 'Settings', onClick: vi.fn() },
    ]
    render(
      <Navigation
        items={items}
        brand={brand}
      />
    )
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })
})
