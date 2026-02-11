
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentActivity() {
    const activities = [
        {
            user: "John Doe",
            action: "Created a new estimate",
            target: "Smith Residence",
            time: "2 hours ago",
            initials: "JD",
        },
        {
            user: "Jane Smith",
            action: "Completed project",
            target: "Downtown Office Complex",
            time: "4 hours ago",
            initials: "JS",
        },
        {
            user: "Mike Johnson",
            action: "Added new customer",
            target: "Greenwood Villa",
            time: "5 hours ago",
            initials: "MJ",
        },
        {
            user: "System",
            action: "Low stock alert",
            target: "Shingles - Black generic",
            time: "1 day ago",
            initials: "SYS",
        },
    ];

    return (
        <Card className="col-span-3 bg-slate-800/50 backdrop-blur border-slate-700 text-slate-100 shadow-lg">
            <CardHeader>
                <CardTitle className="text-slate-100">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {activities.map((activity, index) => (
                        <div key={index} className="flex items-center">
                            <Avatar className="h-9 w-9 border border-slate-600">
                                <AvatarFallback className="bg-slate-700 text-slate-200">{activity.initials}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none text-slate-200">
                                    {activity.user}
                                </p>
                                <p className="text-sm text-slate-400">
                                    {activity.action} - <span className="text-cyan-500">{activity.target}</span>
                                </p>
                            </div>
                            <div className="ml-auto font-medium text-xs text-slate-500">
                                {activity.time}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
