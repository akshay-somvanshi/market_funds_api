import { pool } from "../app.js";


export const getFundAnalytics = async (req, res) => {
    const { id } = req.params;
    // Fetch fund data
    const fundResult = await pool.query("SELECT * FROM funds WHERE id=$1", [
        id,
    ]);

    if (fundResult.rows.length === 0) {
        return res.status(404).json({ error: "Fund not found" });
    }

    const fund = fundResult.rows[0];

    // Fetch investments for this fund
    const investmentsResult = await pool.query(
        "SELECT * FROM investments WHERE fund_id=$1",
        [id]
    );

    const investments = investmentsResult.rows;

    // Fetch investor details for each investment
    const investorsData = [];
    for (const investment of investments) {
        const investorResult = await pool.query(
            "SELECT * FROM investors WHERE id=$1",
            [investment.investor_id]
        );
        if (investorResult.rows.length > 0) {
            investorsData.push({
                investor_id: investment.investor_id,
                investor_name: investorResult.rows[0].name,
                investor_type: investorResult.rows[0].investor_type,
                amount: parseFloat(investment.amount_usd),
                investment_date: investment.investment_date,
            });
        }
    }

    // Calculate total raised with traditional for loop
    let totalRaised = 0;
    for (let i = 0; i < investorsData.length; i++) {
        totalRaised = totalRaised + investorsData[i].amount;
    }

    // Calculate utilization percentage
    const utilizationPct = (totalRaised / parseFloat(fund.target_size_usd)) * 100;

    // Calculate average investment
    const avgInvestment = totalRaised / investments.length;

    // Group by investor type with forEach
    const byType = {};
    investorsData.forEach((inv) => {
        const type = inv.investor_type;
        if (!byType[type]) {
            byType[type] = { count: 0, total: 0 };
        }
        byType[type].count++;
        byType[type].total += inv.amount;
    });

    // Add percentages to investor types using functional approach
    const byInvestorType = Object.keys(byType).reduce((acc, type) => {
        acc[type] = {
            count: byType[type].count,
            total: byType[type].total,
            percentage: (byType[type].total / totalRaised) * 100,
        };
        return acc;
    }, {});

    // Calculate top investors with map and sort
    const investorTotals = investorsData
        .reduce((acc, inv) => {
            const existing = acc.find((x) => x.investor_id === inv.investor_id);
            if (existing) {
                existing.total_invested += inv.amount;
            } else {
                acc.push({
                    investor_id: inv.investor_id,
                    investor_name: inv.investor_name,
                    total_invested: inv.amount,
                });
            }
            return acc;
        }, [])
        .sort((a, b) => b.total_invested - a.total_invested);

    // Add rank and percentage using imperative style
    const topInvestors = [];
    for (let i = 0; i < Math.min(5, investorTotals.length); i++) {
        const investor = investorTotals[i];
        topInvestors.push({
            investor_id: investor.investor_id,
            investor_name: investor.investor_name,
            total_invested: investor.total_invested,
            percentage: (investor.total_invested / totalRaised) * 100,
            rank: i + 1,
        });
    }

    // Calculate management fee (2% of total raised)
    const totalManagementFee = totalRaised * 0.02;

    // Allocate fees across investors
    const feeAllocations = allocateManagementFees(
        totalManagementFee,
        investorsData
    );

    // Format response
    const analytics = {
        fund_id: fund.id,
        total_raised: totalRaised,
        target_size: parseFloat(fund.target_size_usd),
        utilization_pct: utilizationPct,
        investor_count: investorTotals.length,
        average_investment: avgInvestment,
        top_investors: topInvestors,
        by_investor_type: byInvestorType,
        fee_distribution: {
            total_management_fee: totalManagementFee,
            by_investor: feeAllocations,
        },
    };

    res.status(200).json(analytics);
};

/**
 * TODO: IMPLEMENT THIS FUNCTION - Currently returns empty array
 */
function allocateManagementFees(totalFeeAmount, investments) {
    return [];
}
