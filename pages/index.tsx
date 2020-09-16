import { useGetPagesQuery, GetPagesDocument } from '../lib/pages.graphql'
import { getApollo } from '../lib/apollo'
import DivStyled from '../components/DivStyled'

const Index = () => {
  const { pages } = useGetPagesQuery().data!

  const entries = pages!.map((page) => ({
    slug: page!.slug,
    title: page!.title,
    id: page!.id,
  }))

  return entries?.length ? (
    <DivStyled>
      <ul>
        {entries.map((entry) => (
          <li key={entry!.id}>
            <a href={`/${entry.slug}`}>{entry.title}</a>
          </li>
        ))}
      </ul>
    </DivStyled>
  ) : (
    <DivStyled>Empty</DivStyled>
  )
}

export const getStaticProps = async () => {
  const apolloClient = getApollo()

  await apolloClient.query({
    query: GetPagesDocument,
  })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}

export default Index
