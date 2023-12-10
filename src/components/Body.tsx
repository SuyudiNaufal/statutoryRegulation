"use client";
// import CSS
import Link from "next/link";
import styles from "./body.module.css";
import { useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Body() {
  const [statutories, setStatutories] = useState<any[]>([]);
  const [openStatutory, setOpenStatutory] = useState<string[]>([]);
  const [openChapter, setOpenChapter] = useState<string[]>([]);

  const searchParam = useSearchParams();
  const supabase = createClientComponentClient();
  const bagian = searchParam.get("bagian");
  const bab = searchParam.get("bab");
  const peraturan = searchParam.get("peraturan");
  const judul = searchParam.get("judul");
  const router = useRouter();
  const searchEngine = searchParam.get("search");

  const [searchQuery, setSearchQuery] = useState<string>("");
  // ambil statutories
  async function getStatutories() {
    const { data: statutories, error } = await supabase
      .from("statutories")
      .select(
        `*,
            statutory_categories(*),
            statutory_attachments(*),
            chapters(
                *,
                paragraphs(*)
            )
            `
      )
      .order("slug", { foreignTable: "chapters", ascending: true })
      .order("slug", { foreignTable: "chapters.paragraphs", ascending: true });
    if (!statutories) {
      return;
    }

    setStatutories(statutories as any);
  }
  React.useEffect(
    () => {
      getStatutories();
    },
    []
    // [] only run once
  );

  // ambil isi dari bagian

  const [paragraphContent, setParagraphContent] = useState<any[]>([]);
  async function getParagraphContent() {
    const { data: paragraphs, error } = await supabase
      .from("paragraphs")
      .select(
        `*,
            chapters(*)
            `
      )
      // filter
      .eq("slug", bagian);

    if (!paragraphs) {
      return;
    }
    console.log(paragraphs);
    setParagraphContent(paragraphs as any);
  }
  React.useEffect(() => {
    getParagraphContent();
  }, [bagian]);

  // ambil isi dari BAB (Bagian 1, 2 ,dst)
  const [chapterContent, setChapterContent] = useState<any[]>([]);
  async function getChapterContent() {
    const { data: chapters, error } = await supabase
      .from("chapters")
      .select(`*, statutories(*)`)

      // filter
      .eq("slug", peraturan);

    if (!chapters) {
      return;
    }
    console.log(chapters);
    setChapterContent(chapters as any);
  }
  React.useEffect(() => {
    getChapterContent();
  }, [peraturan]);

  // Ambil isi dari Judul Peraturan (Bab 1, 2, dst)
  const [statutoryContent, setStatutoryContent] = useState<any[]>([]);
  async function getStatutoryContent() {
    let { data: statutories, error } = await supabase
      .from("statutories")
      .select("*")
      // Filters
      .eq("slug", judul);
    if (!statutories) {
      return;
    }
    setStatutoryContent(statutories as any);
  }
  React.useEffect(() => {
    getStatutoryContent();
  }, [judul]);

  // Buat konstante untuk welcome sign
  const ketiganyaNull =
    judul === null && bagian === null && peraturan === null ? true : false;

  // Ngasih event ke router untuk push ke
  function handleSearchChange(event: any) {
    const value = event.target.value;
    console.log(value);
    setSearchQuery(value);
  }

  // Buat fungsi untuk submit
  function searchButtonOnClick() {
    router.push(`/?search=${searchQuery}`);
  }
  // Query ke supabase, semuanya dijoin buat filter tree dropdown
  // !inner untuk inner join

  /**
   * Retrieves search statutories based on the provided search engine text.
   * @returns {Promise<void>} A promise that resolves when the search statutories are retrieved.
   */
  async function getSearchStatutories() {
    // Retrieve statutories based on search engine text
    const { data: statutories, error } = await supabase.rpc("search_words", {
      input_text: searchEngine,
    });

    if (error) {
      console.log(error);
      throw error;
    }

    // Extract paragraph IDs from statutories
    const paragraphsIds = statutories.map(
      (statutory: any) => statutory.paragraph_id
    );

    // Extract chapter IDs from statutories and remove duplicates
    const chaptersIds = statutories
      .map((statutory: any, index: number) => {
        if (index === 0) {
          return statutory.chapter_id;
        } else if (statutory.chapter_id !== statutories[index - 1].chapter_id) {
          return statutory.chapter_id;
        }
      })
      .filter((chapterId: any) => chapterId);

    console.log("paragraphsIds: \n", paragraphsIds.join(", "));
    console.log("chapterIds: \n", chaptersIds.join(", "));

    // Retrieve statutories with related data
    const { data: statutories2, error: error2 } = await supabase
      .from("statutories")
      .select(
        `*,
            statutory_categories(*),
            statutory_attachments(*),
            chapters!inner(
                    *,
                    paragraphs!inner(*)
            )
            `
      )
      .in("chapters.paragraphs.id", paragraphsIds);

    if (error2) {
      console.log(error2);
      throw error2;
    }

    // Get all statuory slugs
    const statutoriesSlugs = statutories2.map(
      (statutory: any) => statutory.slug
    );

    // Get all chapter slugs
    const chaptersSlugs = statutories2.map((statutory: any) =>
      statutory.chapters.map((chapter: any) => chapter.slug)
    );

    // Open all statutories and chapters
    setOpenStatutory(statutoriesSlugs);
    setOpenChapter(chaptersSlugs.flat());

    const splittedSearchQuery = searchQuery.split(" ");

    // Add mark to innerHTML words
    // statutories2.forEach((statutory: any) => {
    //   statutory.chapters.forEach((chapter: any) => {
    //     chapter.paragraphs.forEach((paragraph: any) => {
    //       splittedSearchQuery.forEach((word: string) => {
    //         paragraph.paragraph_content = paragraph.paragraph_content.replace(
    //           word.toLowerCase(),
    //           ` <mark>${word}</mark> `
    //         );
    //       });
    //     });
    //   });
    // });

    // console.log(statutories2)

    router.push(
      `/?search=${searchEngine}&bagian=${statutories2[0].chapters[0].paragraphs[0].slug}`
    );

    setStatutories(statutories2 as any);
  }

  React.useEffect(() => {
    if (searchEngine) {
      getSearchStatutories();
    }
  }, [searchEngine]);
  // KODE YANG BAKALAN DITAMPILIN
  // Buat konstanta untuk posisi search dipake

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.bodyLeft}>
        <div className={styles.bodyLeftTop}>
          <div className={styles.bodySearchBar}>
            <input
              type="text"
              placeholder="Search Peraturan"
              className={styles.searchBar}
              value={searchQuery}
              name="searchBar"
              onChange={handleSearchChange}
            />
            <button
              className={styles.buttonSearch}
              onClick={searchButtonOnClick}
            >
              Search
            </button>
            <button
              className={styles.buttonSearch}
              onClick={() => {
                router.push("/");
                getStatutories();
                setOpenStatutory([]);
                setOpenChapter([]);
                setSearchQuery("");
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className={styles.bodyLeftBottom}>
          {/* UNDANG UNDANG  */}
          <div>
            {statutories.length === 0 ? (
              searchEngine ? (
                <span
                  style={{ textAlign: "center", fontSize: 12, marginTop: 16 }}
                >
                  No results found for &ldquo;{searchEngine}&ldquo;
                </span>
              ) : (
                <span style={{ textAlign: "center" }}>Loading....</span>
              )
            ) : (
              statutories.map((statutory) => {
                return (
                  <details
                    className={`${styles.treeNav} ${styles.isExpandable}`}
                    key={statutory.slug}
                    open={openStatutory.includes(statutory.slug)}
                  >
                    <summary
                      className={styles.treeNavTitle}
                      onClick={() => router.push(`/?judul=${statutory.slug}`)}
                    >
                      {statutory.statutory_title}
                    </summary>

                    {/* BAB 1 */}
                    {statutory.chapters.map((chapter: any) => {
                      return (
                        <details
                          className={`${styles.treeNav} ${styles.isExpandable}`}
                          key={chapter.slug}
                          open={openChapter.includes(chapter.slug)}
                        >
                          <summary
                            className={styles.treeNavTitle}
                            onClick={() =>
                              router.push(`/?peraturan=${chapter.slug}`)
                            }
                          >
                            {chapter.chapter_title}
                          </summary>

                          <>
                            <div className={styles.treeNavTitleDiv}>
                              {chapter.paragraphs.map((paragraph: any) => {
                                return (
                                  <Link
                                    className={styles.treeNavTitleDivList}
                                    href={`/?bagian=${paragraph.slug}`}
                                    key={paragraph.slug}
                                  >
                                    {paragraph.paragraph_title}
                                  </Link>
                                );
                              })}
                            </div>
                          </>
                        </details>
                      );
                    })}
                  </details>
                );
              })
            )}
          </div>
        </div>
      </div>
      <div className={styles.bodyRight}>
        <div className={styles.bodyRightTop}>
          <h4>
            {judul
              ? statutoryContent[0]?.statutory_title
              : bagian
              ? paragraphContent[0]?.chapters.chapter_title
              : peraturan
              ? chapterContent[0]?.chapter_title
              : `Homepage`}
          </h4>
        </div>
        <div className={styles.bodyRightBottom}>
          {/* TAMBAHIN YANG BAB */}

          {
            <div>
              {ketiganyaNull ? (
                // Render Component1 when both values are null
                <div>Selamat Datang</div>
              ) : (
                // Render Component2 when at least one value is not null
                <>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: judul
                        ? statutoryContent[0]?.statutory_content
                        : bagian
                        ? paragraphContent[0]?.paragraph_content
                        : peraturan
                        ? chapterContent[0]?.chapter_content
                        : null,
                    }}
                  />
                  <p>
                    <Link
                      href={
                        bagian
                          ? `/?peraturan=${paragraphContent[0].chapters.slug}`
                          : peraturan
                          ? `/?judul=${chapterContent[0]?.statutories?.slug}`
                          : `/`
                      }
                    >
                      Kembali{" "}
                      {bagian
                        ? paragraphContent[0]?.chapters.chapter_title
                        : peraturan
                        ? chapterContent[0]?.statutory_title
                        : null}
                    </Link>
                  </p>
                </>
              )}
            </div>
          }
        </div>
      </div>
    </div>
  );
}
