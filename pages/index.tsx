import Link from 'next/link'
import { useGetUsersQuery, GetUsersDocument } from '../lib/user.graphql'
import { initializeApollo } from '../lib/apollo'
import DivStyled from '../components/DivStyled'

const Index = () => {
  const { user } = useGetUsersQuery().data!

  return (
    user?.length ? 
    <DivStyled>
      You're signed in as {user[0].name} and you're {user[0].status} go to the{' '}
      <Link href="/about">
        <a>about</a>
      </Link>{' '}
      page.
    </DivStyled> : <DivStyled>Not signed in</DivStyled>
  )
}

export const getStaticProps = async () => {
  const apolloClient = initializeApollo()

  await apolloClient.query({
    query: GetUsersDocument,
  })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}

export default Index
