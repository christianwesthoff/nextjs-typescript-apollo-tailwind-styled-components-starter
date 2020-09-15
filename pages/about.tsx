import Link from 'next/link'
import DivStyled from '../components/DivStyled'

export default function About() {
  return (
    <DivStyled>
      Welcome to the about page. Go to the{' '}
      <Link href="/">
        <a>Home</a>
      </Link>{' '}
      page.
    </DivStyled>
  )
}
