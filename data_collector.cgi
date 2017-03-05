#!/usr/bin/perl -ws                                                                       
use CGI;

my $query = CGI->new;
my $id = $query->param( 'participant_id' );

print $query->header;
print "You are participant $id!";

# Create outfile for saving data!
my $filename = "participant_".$id."_data.csv";
open( OUTFILE, ">>$filename") or die $!, "Couldn\'t open outfile for reading!\n";

my @keys = $query->param();
print OUTFILE 'pause_time'."\t".$query->param('pause_time')."\n";
foreach my $key (@keys) {
    if (($key ne 'participant_id') && ($key ne 'pause_time')) {
		print OUTFILE $key."\t";
		print OUTFILE $query->param($key);
		print OUTFILE "\n";
    }
}
close( OUTFILE );

1;
