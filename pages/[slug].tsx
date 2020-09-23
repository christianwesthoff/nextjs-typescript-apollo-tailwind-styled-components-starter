import { useGetPagesQuery, GetPagesDocument } from '../graphql/pages.graphql'
import DivStyled from '../components/DivStyled'
import { useRouter } from 'next/router'
import {
  getStaticPathsFactory,
  getStaticPropsFactory,
} from '../utils/nextjs-utils'

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
export const getStaticPaths = getStaticPathsFactory(
  GetPagesDocument,
  'pages',
  'slug'
)

export const getStaticProps = getStaticPropsFactory(GetPagesDocument)

// Server side
// export const getServerSideProps = getServerSidePropsFactory(GetPagesDocument)

export default Index
