import React, { useEffect } from 'react'
import { CombinedError } from 'urql'

import { convertCoinToCoin } from '@core/exchange'
import { NFT_ORDER_PAGE_LIMIT } from '@core/network/api/nfts'
import {
  AssetFilter,
  AssetFilterFields,
  AssetSortFields,
  FilterOperators,
  InputMaybe,
  SortDirection,
  useAssetsQuery
} from 'generated/graphql.types'

import NftAssetItem from '../components/NftAssetItem'
import { NftFilterFormValuesType } from '../NftFilter'

const NftFirehoseResults: React.FC<Props> = ({
  formValues,
  page,
  setIsFetchingNextPage,
  setMaxItemsFetched,
  setNextPageFetchError
}) => {
  const filter: InputMaybe<InputMaybe<AssetFilter> | InputMaybe<AssetFilter>[]> =
    formValues?.collection
      ? [
          {
            field: AssetFilterFields.CollectionSlug,
            value: formValues.collection
          }
        ]
      : []

  if (formValues?.max) {
    filter.push({
      field: AssetFilterFields.Price,
      operator: FilterOperators.Lt,
      value: convertCoinToCoin({ baseToStandard: false, coin: 'ETH', value: formValues?.max })
    })
  }

  if (formValues?.min) {
    filter.push({
      field: AssetFilterFields.Price,
      operator: FilterOperators.Gt,
      value: convertCoinToCoin({ baseToStandard: false, coin: 'ETH', value: formValues?.min })
    })
  }

  if (formValues?.verifiedOnly) {
    // need BE support
  }

  const sort = formValues?.sortBy
    ? {
        by: formValues.sortBy.split('-')[0] as AssetSortFields,
        direction: formValues.sortBy.split('-')[1] as SortDirection
      }
    : { by: AssetSortFields.DateIngested, direction: SortDirection.Desc }

  const [result] = useAssetsQuery({
    requestPolicy: 'network-only',
    variables: {
      filter,
      forSale: Boolean(formValues?.forSale),
      limit: NFT_ORDER_PAGE_LIMIT,
      offset: page * NFT_ORDER_PAGE_LIMIT,
      sort
    }
  })

  useEffect(() => {
    setNextPageFetchError(result.error)
  }, [result.error])

  useEffect(() => {
    setIsFetchingNextPage(result.fetching)
  }, [result.fetching])

  useEffect(() => {
    if (result.data?.assets.length !== undefined) {
      setMaxItemsFetched(result.data.assets.length < NFT_ORDER_PAGE_LIMIT)
    }
  }, [result.data?.assets?.length, setMaxItemsFetched])

  return (
    <>
      {result?.data?.assets?.map((asset) => {
        return asset ? <NftAssetItem asset={asset} /> : null
      })}
    </>
  )
}

type Props = {
  formValues: NftFilterFormValuesType
  page: number
  setIsFetchingNextPage: (isFetching: boolean) => void
  setMaxItemsFetched: (maxItemsFetched: boolean) => void
  setNextPageFetchError: (error: CombinedError | undefined) => void
}

export default NftFirehoseResults
