import ExpensesChart from "./Chartcomponent";
import Transactions from "./dropdown";
import OverviewBoxes from "./overviewboxes";

export default function AnalyticsComp({ transactions }) {
    return (
        <div>
            <OverviewBoxes transactions={transactions} />

            <ExpensesChart transactions={transactions} />
        </div>
    )
}
