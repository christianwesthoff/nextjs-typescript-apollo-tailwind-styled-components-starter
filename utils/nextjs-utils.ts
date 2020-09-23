import { NormalizedCacheObject } from '@apollo/client'
import { DocumentNode } from 'graphql'
import { GetServerSideProps, GetStaticProps, GetStaticPaths } from 'next'
import { getApollo } from '../graphql/apollo'

export const hydrateApolloCache = async (
  ...args: Array<DocumentNode | [DocumentNode, any]>
): Promise<NormalizedCacheObject> => {
  const apolloClient = getApollo()
  const queryCalls = args.map((param) =>
    Array.isArray(param)
      ? () => apolloClient.query({ query: param[0], variables: param[1] })
      : () => apolloClient.query({ query: param })
  )
  await Promise.all(queryCalls)
  return apolloClient.cache.extract()
}

export const getServerSidePropsFactory: (
  ...args: Array<DocumentNode | [DocumentNode, any]>
) => GetServerSideProps = (...args) => async ({ params }) => {
  const initialApolloState = await hydrateApolloCache(...args)
  return {
    props: {
      initialApolloState,
      ...params,
    },
  }
}

export const getStaticPropsFactory: (
  ...args: Array<DocumentNode | [DocumentNode, any]>
) => GetStaticProps = (...args) => async ({ params }) => {
  const initialApolloState = await hydrateApolloCache(...args)
  return {
    props: {
      initialApolloState,
      ...params,
    },
  }
}

export const getStaticPathsFactory: (
  params: DocumentNode | [DocumentNode, any],
  querySelector: string,
  slugSelector: string,
  queryFieldSelector?: string,
  fallback?: boolean
) => GetStaticPaths = (
  params,
  queryResultSelector,
  slugSelector,
  queryFieldSelector = slugSelector,
  fallback = false
) => async () => {
  const apolloClient = getApollo()

  const { data } = Array.isArray(params)
    ? await apolloClient.query<any>({
        query: params[0] as DocumentNode,
        variables: params[1],
      })
    : await apolloClient.query<any>({
        query: params as DocumentNode,
      })
  const results = data[queryResultSelector]
  const paths = results!.map((elem: any) => ({
    params: { [slugSelector]: elem[queryFieldSelector] },
  }))

  return {
    paths,
    fallback,
  }
}
