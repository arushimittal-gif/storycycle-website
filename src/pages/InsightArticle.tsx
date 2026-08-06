import { Navigate, useParams } from 'react-router-dom'
import { Meta } from '../components/Meta'
import { getArticleBySlug, getNextArticle } from '../data/articles'
import {
  ArticleMain,
  ArticleHero,
  ArticleProse,
  ArticleP,
  ArticleH2,
  ArticleList,
  ArticlePullQuote,
  ArticleGrid,
  ArticleHighlight,
  ArticleCTABand,
  ArticleFooterNav,
  ArticleNext,
} from '../components/ArticleLayout'

export function InsightArticle() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? getArticleBySlug(slug) : undefined
  const next = slug ? getNextArticle(slug) : undefined

  if (!article) return <Navigate to="/insights" replace />

  return (
    <>
      <Meta title={`${article.title} — StoryCycle Insights`} description={article.sub} />
      <ArticleMain heroImage={article.heroImage} heroAlt={article.heroAlt}>
        <ArticleHero
          category={article.category}
          title={article.title}
          underline={article.underline}
          sub={article.sub}
          date={article.date}
          readTime={article.readTime}
          heroImage={article.heroImage}
          heroAlt={article.heroAlt}
        />
        <ArticleProse>
          {article.content.map((block, i) => {
            switch (block.type) {
              case 'p':
                return <ArticleP key={i}>{block.text}</ArticleP>
              case 'h2':
                return <ArticleH2 key={i} num={block.num}>{block.text}</ArticleH2>
              case 'list':
                return <ArticleList key={i} items={block.items} />
              case 'quote':
                return <ArticlePullQuote key={i}>{block.text}</ArticlePullQuote>
              case 'grid':
                return <ArticleGrid key={i} items={block.items} />
              case 'highlight':
                return <ArticleHighlight key={i} label={block.label} items={block.items} />
              default:
                return null
            }
          })}
        </ArticleProse>
      </ArticleMain>
      {next && (
        <ArticleNext
          slug={next.slug}
          category={next.category}
          title={next.title}
          date={next.date}
          readTime={next.readTime}
        />
      )}
      <ArticleCTABand
        heading="Map your narrative with us"
        underline="narrative"
        body="Reach out and we can help you uncover the story your audience has been waiting for. Twenty minutes is enough to find the throughline."
      />
      <ArticleFooterNav to="/insights" label="Back to Insights" />
    </>
  )
}
