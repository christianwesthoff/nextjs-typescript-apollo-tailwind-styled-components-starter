import {
  useGetPagesQuery,
  GetPagesDocument,
  GetPagesQuery,
} from '../lib/pages.graphql'
import { getApollo } from '../lib/apollo'
import DivStyled from '../components/DivStyled'
import { GetStaticPaths, GetStaticProps, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'

type IndexProps = {
  id: any
  name: string
  slug: string
}

const Index: React.FC<IndexProps> = () => {
  const { query } = useRouter()
  const { slug } = query
  const { data, loading, error } = useGetPagesQuery()
  const pages = data?.pages
  const thisPage = pages?.find((page) => page!.slug === slug)

  return loading ? (
    <DivStyled>Loading...</DivStyled>
  ) : thisPage ? (
    <DivStyled>
      <h1>
        {thisPage.title} (/{thisPage.slug})
      </h1>
      <p>{thisPage.description}</p>
    </DivStyled>
  ) : (
    <DivStyled>{error}</DivStyled>
  )
}

// Static build time
export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = getApollo()

  const {
    data: { pages },
  } = await apolloClient.query<GetPagesQuery>({
    query: GetPagesDocument,
  })

  const paths = pages!.map((page) => ({ params: { slug: page!.slug } }))

  return {
    paths: paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = getApollo()

  await apolloClient.query({
    query: GetPagesDocument,
  })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      ...params,
    },
  }
}

// Server side
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const apolloClient = getApollo()

//   await apolloClient.query({
//     query: GetPagesDocument,
//   })

//   return {
//     props: {
//       initialApolloState: apolloClient.cache.extract(),
//       ...params,
//     },
//   }
// }

// Client side
// export const getStaticPaths: GetStaticPaths = async () => {
//   const apolloClient = getApollo()

//   const {
//     data: { pages },
//   } = await apolloClient.query<GetPagesQuery>({
//     query: GetPagesDocument,
//   })

//   const paths = pages!.map((page) => ({ params: { slug: page!.slug } }))

//   return {
//     paths: paths,
//     fallback: false,
//   }
// }

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   return {
//     props: {
//       ...params,
//     },
//   }
// }

export default Index
