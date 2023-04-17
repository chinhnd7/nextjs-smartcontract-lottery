import { useEffect } from "react"
import { useMoralis } from "react-moralis"

const ManualHeader = () => {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis()

    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])
    // with dependency array:
    // automatically run on load
    // then, it'll run checking the value

    // no dependency array: run anytime something re-renders
    // CAREFUL with this!! Because then you can get CIRCULAR render

    // blank dependency array: []
    // just run one time, once on load

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected") // để useEffect không tự gọi enableWeb3() khi isWeb3Enabled đã về false
                deactivateWeb3() // set isWeb3Enabled to false
                console.log("Null account found")
            }
        })
    }, [])

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("connected", "injected")
                        }
                    }}
                    disabled={isWeb3EnableLoading} // khi metamask đang loading thì button mờ đi (disabled)
                >
                    Connect
                </button>
            )}
        </div>
    )
}

export default ManualHeader
