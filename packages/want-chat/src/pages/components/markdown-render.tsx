import { BubbleProps } from '@ant-design/x'
import { Button, message } from 'antd'
import { createStyles } from 'antd-style'
import { CopyOutlined } from '@ant-design/icons'

import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'

const useStyles = createStyles(({ token, css }) => ({
  codeBlock: css`
    position: relative;

    pre {
      padding: 16px;
      border-radius: 8px;
      background: ${token.colorFillTertiary};
    }

    .copy-button {
      position: absolute;
      top: 8px;
      right: 8px;
      opacity: 0;
      transition: all 0.2s ease-in-out;
      cursor: pointer;
      pointer-events: none;
      user-select: none;
    }

    &:hover .copy-button {
      opacity: 1;
      pointer-events: auto;
    }
  `,
}))

type Marked = typeof import('marked')
type Prism = typeof import('prismjs')

const useMarkdownRenderer = () => {
  const librariesRef = useRef<{
    mdParser: Marked | null
    prism: Prism | null
    error: Error | null
  }>({
    mdParser: null,
    prism: null,
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    const loadLibraries = async () => {
      try {
        const [marked, prism] = await Promise.all([
          import('marked'),
          import('prismjs'),
        ])

        await Promise.all([
          import('prismjs/components/prism-javascript'),
          import('prismjs/components/prism-typescript'),
          import('prismjs/components/prism-json'),
          import('prismjs/components/prism-bash'),
        ])

        marked.marked.setOptions({
          gfm: true,
          breaks: true,
        })

        const highlight = (code: string, lang: string): string => {
          if (lang && prism.languages[lang]) {
            try {
              return String(prism.highlight(code, prism.languages[lang], lang))
            } catch (error) {
              console.error('Error highlighting code:', error)
              return code
            }
          }
          return code
        }

        const renderer = new marked.marked.Renderer()
        renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
          const language = lang ?? ''
          const highlighted = String(highlight(text, language))
          return `<pre data-raw-code="${encodeURIComponent(text)}"><code class="language-${language}">${highlighted}</code></pre>`
        }

        marked.marked.use({ renderer })

        if (isMounted) {
          librariesRef.current = {
            mdParser: marked,
            prism: prism,
            error: null,
          }
        }
      } catch (error) {
        if (isMounted) {
          librariesRef.current.error = error as Error
        }
      }
    }

    void loadLibraries()

    return () => {
      isMounted = false
    }
  }, [])

  return librariesRef
}

const MarkdownRenderer: BubbleProps['messageRender'] = (content) => {
  const { styles } = useStyles()
  const containerRef = useRef<HTMLDivElement>(null)
  const librariesRef = useMarkdownRenderer()

  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (librariesRef.current.mdParser && librariesRef.current.prism) {
      setIsReady(true)
    }
  }, [librariesRef.current.mdParser, librariesRef.current.prism])

  const renderMarkdown = (content: string) => {
    if (!isReady) {
      throw new Error('Markdown renderer not ready')
    }
    if (librariesRef.current.error) {
      throw new Error(librariesRef.current.error.message)
    }
    return librariesRef.current.mdParser!.marked.parse(content)
  }

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      message.success('代码已复制到剪贴板')
    } catch (err) {
      message.error('复制失败，请手动复制')
      console.error('Failed to copy:', err)
    }
  }

  useEffect(() => {
    if (librariesRef.current.error) {
      return
    }
    if (!librariesRef.current.mdParser || !librariesRef.current.prism) {
      return
    }
    if (!containerRef.current) return

    const container = containerRef.current
    const preBlocks = container.querySelectorAll('pre')

    preBlocks.forEach((pre) => {
      const wrapper = document.createElement('div')
      wrapper.className = styles.codeBlock

      const rawCode = decodeURIComponent(
        pre.getAttribute('data-raw-code') ?? '',
      )

      pre.parentElement?.insertBefore(wrapper, pre)
      wrapper.appendChild(pre)

      const buttonDomNode = document.createElement('div')
      const buttonRoot = createRoot(buttonDomNode)

      buttonRoot.render(
        <Button
          className="copy-button"
          size="small"
          ghost
          type="primary"
          icon={<CopyOutlined />}
          onClick={() => void handleCopy(rawCode)}
        >
          复制
        </Button>,
      )

      wrapper.appendChild(buttonDomNode)
    })
  }, [content, styles.codeBlock])

  if (!isReady) {
    return <div>Loading markdown renderer...</div>
  }

  try {
    return (
      <div
        ref={containerRef}
        className="markdown-body"
        dangerouslySetInnerHTML={{
          __html: renderMarkdown(content),
        }}
      />
    )
  } catch (error) {
    if (error instanceof Error) {
      return <div>Error loading markdown renderer: {error.message}</div>
    }
    return <div>Unknown error occurred while rendering markdown</div>
  }
}

export default MarkdownRenderer
