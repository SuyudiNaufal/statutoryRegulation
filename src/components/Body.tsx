'use client'
// import CSS
import Link from "next/link"
import styles from "./body.module.css"
import { useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react"
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'



export default function Body() {
    const [statutories, setStatutories] = useState<any[]>([])
    const searchParam = useSearchParams();
    const supabase = createClientComponentClient();
    const bagian = searchParam.get("bagian");
    const bab = searchParam.get("bab");
    const peraturan = searchParam.get("peraturan")
    const router = useRouter()


    // ambil statutories
    async function getStatutories() {
        const { data: statutories, error } = await supabase
            .from('statutories')
            .select(`*,
            statutory_categories(*),
            statutory_attachments(*),
            chapters(
                *,
                paragraphs(*)
            )
            `)
        if (!statutories) {
            return
        }
        setStatutories(statutories as any)
    }
    React.useEffect(() => { getStatutories() }, []
        // [] only run once
    )
    console.log(statutories)

    const [paragraphContent, setParagraphContent] = useState<any[]>([])
    async function getParagraphContent() {
        const { data: paragraphs, error } = await supabase
            .from('paragraphs')
            .select(`*,
            chapters(*)
            `)
            // filter
            .eq('slug', bagian)

        if (!paragraphs) {
            return
        }
        setParagraphContent(paragraphs as any)
    }
    React.useEffect(() => { getParagraphContent() }, [bagian])

    const [chapterContent, setChapterContent] = useState<any[]>([])
    async function getChapterContent() {
        const { data: chapters, error } = await supabase
            .from('chapters')
            .select("*")
            // filter
            .eq('slug', peraturan)
        if (!chapters) {
            return
        }
        setChapterContent(chapters as any)
    }
    React.useEffect(() => { getChapterContent() }, [peraturan])

    const keduanyaNull = bagian === null && peraturan === null ? true : false;


    // KODE YANG BAKALAN DITAMPILIN
    return (
        <div className={styles.bodyContainer}>
            <div className={styles.bodyLeft}>
                <div className={styles.bodyLeftTop}>
                    <div className={styles.bodySearchBar}>
                        <input type="text" placeholder="Search Peraturan" className={styles.searchBar} name="searchBar"></input>
                        <button className={styles.buttonSearch}>Search</button>
                    </div>
                </div>
                <div className={styles.bodyLeftBottom}>

                    <details className={`${styles.treeNav} ${styles.isExpandable}`}>
                        <summary className={styles.treeNavTitle}>Undang-Undang</summary>

                        {statutories.map((statutory) => {
                            return (<details className={`${styles.treeNav} ${styles.isExpandable}`} key={statutory.id}>
                                <summary className={styles.treeNavTitle}>{statutory.statutory_title}</summary>


                                {/* BAB 1 */}
                                {statutory.chapters.map((chapter: any) => {
                                    return <details className={`${styles.treeNav} ${styles.isExpandable}`} key={chapter.id}>
                                        <summary className={styles.treeNavTitle} onClick={() => router.push(`/?peraturan=${chapter.slug}`)}>{chapter.chapter_title}</summary>


                                        <>
                                            <div className={styles.treeNavTitleDiv}>

                                                {chapter.paragraphs.map((paragraph: any) => {

                                                    return (
                                                        <Link className={styles.treeNavTitleDivList} href={`/?bagian=${paragraph.slug}`} key={paragraph.id}>{paragraph.paragraph_title}</Link>
                                                    )
                                                })}
                                            </div></>
                                    </details>
                                })}

                            </details>)
                        })}
                    </details>
                </div>
            </div>
            <div className={styles.bodyRight}>
                <div className={styles.bodyRightTop}>
                    <h4>{
                        bagian ? paragraphContent[0]?.chapters.chapter_title : peraturan ? chapterContent[0]?.chapter_title : `Homepage`
                    }</h4>
                </div>
                <div className={styles.bodyRightBottom}>

                    {
                        <div>
                            {keduanyaNull ? (
                                // Render Component1 when both values are null
                                <div>Selamat Datang
                                </div>
                            ) : (
                                // Render Component2 when at least one value is not null
                                <>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                bagian ? paragraphContent[0]?.paragraph_content : peraturan ? chapterContent[0]?.chapter_content : null
                                        }}
                                    />
                                    <p><Link href={`/?peraturan=${paragraphContent[0]?.chapters.slug}`}>
                                        Kembali ke {bagian ? paragraphContent[0]?.chapters.chapter_title : peraturan ? chapterContent[0]?.chapter_title : null}
                                    </Link></p>
                                </>)}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}