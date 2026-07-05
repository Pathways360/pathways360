import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { Spinner } from '@/components/ui/spinner';

export function NotificationPreferences() {
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    // Notification Types
    alertsEnabled: true,
    messagesEnabled: true,
    referralsEnabled: true,
    appointmentsEnabled: true,
    remindersEnabled: true,
    // Frequency
    frequency: 'immediate' as 'immediate' | 'hourly_digest' | 'daily_digest',
    // Quiet Hours
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    // Sound & Browser
    soundEnabled: true,
    browserNotificationsEnabled: false,
  });

  const { data: savedPreferences, isLoading: isLoadingPreferences } = trpc.notifications.getPreferences.useQuery();
  const updatePreferencesMutation = trpc.notifications.updatePreferences.useMutation();

  useEffect(() => {
    if (savedPreferences) {
      setPreferences({
        alertsEnabled: savedPreferences.alertsEnabled ?? true,
        messagesEnabled: savedPreferences.messagesEnabled ?? true,
        referralsEnabled: savedPreferences.referralsEnabled ?? true,
        appointmentsEnabled: savedPreferences.appointmentsEnabled ?? true,
        remindersEnabled: savedPreferences.remindersEnabled ?? true,
        frequency: (savedPreferences.frequency as 'immediate' | 'hourly_digest' | 'daily_digest') || 'immediate',
        quietHoursEnabled: savedPreferences.quietHoursEnabled ?? false,
        quietHoursStart: savedPreferences.quietHoursStart || '22:00',
        quietHoursEnd: savedPreferences.quietHoursEnd || '08:00',
        soundEnabled: savedPreferences.soundEnabled ?? true,
        browserNotificationsEnabled: savedPreferences.browserNotificationsEnabled ?? false,
      });
    }
  }, [savedPreferences]);

  const handleToggle = (key: string) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key as keyof typeof preferences] }));
  };

  const handleFrequencyChange = (value: string) => {
    setPreferences(prev => ({ ...prev, frequency: value as any }));
  };

  const handleTimeChange = (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updatePreferencesMutation.mutateAsync({
        appointmentReminders: preferences.appointmentsEnabled,
        medicationReminders: preferences.remindersEnabled,
        goalReminders: preferences.remindersEnabled,
        dailyCoachMessage: true,
        weeklyProgressSummary: true,
        devotionals: false,
        motivationalMessages: true,
        crisisAlerts: true,
        alertsEnabled: preferences.alertsEnabled,
        messagesEnabled: preferences.messagesEnabled,
        referralsEnabled: preferences.referralsEnabled,
        appointmentsEnabled: preferences.appointmentsEnabled,
        remindersEnabled: preferences.remindersEnabled,
        frequency: preferences.frequency,
        quietHoursEnabled: preferences.quietHoursEnabled,
        quietHoursStart: preferences.quietHoursStart,
        quietHoursEnd: preferences.quietHoursEnd,
        soundEnabled: preferences.soundEnabled,
        browserNotificationsEnabled: preferences.browserNotificationsEnabled,
      });
      toast.success('Preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingPreferences) {
    return (
      <div className="container max-w-2xl py-8 flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Notification Preferences</h1>
        <p className="text-muted-foreground">Customize how and when you receive notifications</p>
      </div>

      <Tabs defaultValue="types" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="types">Notification Types</TabsTrigger>
          <TabsTrigger value="frequency">Frequency</TabsTrigger>
          <TabsTrigger value="quiet">Quiet Hours</TabsTrigger>
        </TabsList>

        {/* Notification Types Tab */}
        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Types</CardTitle>
              <CardDescription>Choose which types of notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="alerts">Alerts & Warnings</Label>
                <Switch
                  id="alerts"
                  checked={preferences.alertsEnabled}
                  onCheckedChange={() => handleToggle('alertsEnabled')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="messages">Messages</Label>
                <Switch
                  id="messages"
                  checked={preferences.messagesEnabled}
                  onCheckedChange={() => handleToggle('messagesEnabled')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="referrals">Referrals</Label>
                <Switch
                  id="referrals"
                  checked={preferences.referralsEnabled}
                  onCheckedChange={() => handleToggle('referralsEnabled')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="appointments">Appointments</Label>
                <Switch
                  id="appointments"
                  checked={preferences.appointmentsEnabled}
                  onCheckedChange={() => handleToggle('appointmentsEnabled')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="reminders">Reminders</Label>
                <Switch
                  id="reminders"
                  checked={preferences.remindersEnabled}
                  onCheckedChange={() => handleToggle('remindersEnabled')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sound & Browser</CardTitle>
              <CardDescription>Control sound and browser notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sound">Sound Notifications</Label>
                <Switch
                  id="sound"
                  checked={preferences.soundEnabled}
                  onCheckedChange={() => handleToggle('soundEnabled')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="browser">Browser Notifications</Label>
                <Switch
                  id="browser"
                  checked={preferences.browserNotificationsEnabled}
                  onCheckedChange={() => handleToggle('browserNotificationsEnabled')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Frequency Tab */}
        <TabsContent value="frequency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Frequency</CardTitle>
              <CardDescription>How often would you like to receive notifications?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Delivery Method</Label>
                <Select value={preferences.frequency} onValueChange={handleFrequencyChange}>
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate - Get notifications as they happen</SelectItem>
                    <SelectItem value="hourly_digest">Hourly Digest - Receive once per hour</SelectItem>
                    <SelectItem value="daily_digest">Daily Digest - Receive once per day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900">
                <p className="font-semibold mb-2">Frequency Details:</p>
                {preferences.frequency === 'immediate' && (
                  <p>You will receive notifications immediately as they occur.</p>
                )}
                {preferences.frequency === 'hourly_digest' && (
                  <p>Notifications will be collected and sent to you once per hour at the top of the hour.</p>
                )}
                {preferences.frequency === 'daily_digest' && (
                  <p>Notifications will be collected and sent to you once per day at 9:00 AM.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quiet Hours Tab */}
        <TabsContent value="quiet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quiet Hours</CardTitle>
              <CardDescription>Set a time period when you don't want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="quiet-enabled">Enable Quiet Hours</Label>
                <Switch
                  id="quiet-enabled"
                  checked={preferences.quietHoursEnabled}
                  onCheckedChange={() => handleToggle('quietHoursEnabled')}
                />
              </div>

              {preferences.quietHoursEnabled && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-time">Start Time</Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={preferences.quietHoursStart}
                        onChange={(e) => handleTimeChange('quietHoursStart', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-time">End Time</Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={preferences.quietHoursEnd}
                        onChange={(e) => handleTimeChange('quietHoursEnd', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg text-sm text-amber-900">
                    <p className="font-semibold mb-2">Quiet Hours Active:</p>
                    <p>
                      From {preferences.quietHoursStart} to {preferences.quietHoursEnd}, you won't receive notifications unless they are critical alerts.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex gap-2">
        <Button onClick={handleSave} disabled={loading || updatePreferencesMutation.isPending} className="gap-2">
          {loading || updatePreferencesMutation.isPending ? (
            <>
              <Spinner className="h-4 w-4" />
              Saving...
            </>
          ) : (
            'Save Preferences'
          )}
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
