export interface ReferencedDataComponentProps<T = unknown> {
  dataId: string
  type?: string
  onResolved?: (data: T) => void
  onError?: (error: Error) => void
  onLoading?: () => void
}

export type ReferencedDataComponent<T = unknown> = React.ComponentType<
  ReferencedDataComponentProps<T>
>