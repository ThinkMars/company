import { BubbleProps } from '@ant-design/x'
import { Button, message } from 'antd'
import { createStyles } from 'antd-style'
import { CopyOutlined } from '@ant-design/icons'

import markdownit from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

import { useEffect, useRef } from 'react'
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

const md = markdownit({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang }).value
        return `<pre data-raw-code="${encodeURIComponent(str)}"><code class="hljs ${lang}">${highlighted}</code></pre>`
      } catch (error) {
        console.error(error)
      }
    }
    return `<pre data-raw-code="${encodeURIComponent(str)}"><code>${md.utils.escapeHtml(str)}</code></pre>`
  },
})

const MarkdownRenderer: BubbleProps['messageRender'] = (content) => {
  const { styles } = useStyles()
  const containerRef = useRef<HTMLDivElement>(null)

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

  return (
    <div
      ref={containerRef}
      className="markdown-body"
      dangerouslySetInnerHTML={{
        __html: md.render(content),
      }}
    />
  )
}

export default MarkdownRenderer
