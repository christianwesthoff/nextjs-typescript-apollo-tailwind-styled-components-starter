import { ApolloQueryResult, DocumentNode } from '@apollo/client'
import { getApollo } from '../graphql/apollo'

export type WithInitalApolloState<T> = {
  initialApolloState: T
}

export const hydrateViewState: <
  TQuery extends DocumentNode,
  TParams extends {} = any,
  TResult extends {} = any
>(
  query: TQuery,
  params?: TParams
) => Promise<
  [(WithInitalApolloState<any> & TParams) | WithInitalApolloState<any>, TResult]
> = async (query, params) => {
  const apolloClient = getApollo()

  const queryResult = await apolloClient.query({
    query,
  })

  if (queryResult.error) throw Error('Could not fetch data.')

  const { data } = queryResult

  const initialApolloState = apolloClient.cache.extract() as any
  return [
    params
      ? {
          initialApolloState,
          ...params,
        }
      : {
          initialApolloState,
        },
    data,
  ]
}

// const getNextJsSelectors: <
//   TQuery extends DocumentNode,
//   TParams extends {} = any,
//   TResult extends {} = any
// >(
//   query: TQuery,
//   params?: TParams
// ) => {
//   getProps: (
//     selector: (data: TResult) => any
//   ) => Promise<{
//     props: any
//   }>
//   getPaths: (
//     selector: (data: TResult) => any,
//     fallback?: boolean
//   ) => Promise<{
//     paths: any
//     fallback: boolean
//   }>
// } = (query, params) => {
//   let result: any
//   return {
//     getProps: async (selector) => {
//       if (!result) result = await hydrateViewState(query, params)
//       return {
//         props: {
//           ...result[0],
//           ...selector(result[1]),
//         },
//       }
//     },
//     getPaths: async (selector, fallback = false) => {
//       if (!result) result = await hydrateViewState(query, params)
//       return {
//         paths: selector(result[1]),
//         fallback,
//       }
//     },
//   }
// }

// export default getNextJsSelectors
