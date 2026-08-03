// Per-page document metadata. React 19 hoists <title>/<meta>/<link> rendered
// anywhere in the component tree up into <head>, so no helmet library or
// provider is needed — render <Meta> as the first child of any page.
export function Meta({ title, description }: { title: string; description?: string }) {
  return (
    <>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
    </>
  )
}
