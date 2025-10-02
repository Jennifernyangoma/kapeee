type Props = {
    title: string;
    value: string | number;
};

export default function DashboardCard({ title, value }: Props) {
    return (
        <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-lg font-semibold">{title}</p>
            <p className="text-2xl mt-2">{value}</p>
        </div>
    );
}
